#!/usr/bin/env python3
"""Validate the NightOps starter library and build the starter menus.

Usage: python3 catalog/build_catalog.py

Reads (from this folder):
  library-items.csv     every item in the NightOps Library
  recipes.csv           ingredient lines for cocktails, shots and mocktails
  country-defaults.json pack sizes and pours per launch market

Writes:
  menu-templates.json   starter menu per venue mode and market (seed data for the app)
  starter-menus.md      the same starter menus, readable by people

Exits with status 1 and a list of problems if the data is inconsistent.
"""
import csv
import json
import sys
from collections import defaultdict
from pathlib import Path

HERE = Path(__file__).resolve().parent

MARKETS = ["NG", "US", "CA", "GB"]
MARKET_LABELS = {"NG": "🇳🇬 Nigeria", "US": "🇺🇸 United States", "CA": "🇨🇦 Canada", "GB": "🇬🇧 United Kingdom"}
MODES = {"R": "restaurant", "N": "nightclub", "B": "bar", "L": "lounge"}

ITEM_TYPES = {
    "spirit", "liqueur", "wine", "sparkling", "beer", "cider", "rtd", "soft", "mixer", "water",
    "hot", "cocktail", "mocktail", "shot", "food", "dessert", "package", "service", "shisha",
    "entry", "ingredient",
}
RECIPE_TYPES = {"cocktail", "mocktail", "shot"}
PACKS = {
    "spirit_bottle", "wine_bottle", "magnum", "beer_bottle", "can", "draught", "bottle_small",
    "litre", "kg", "bunch", "each", "serving", "portion",
}
SELL_UNITS = {
    "shot", "double", "bottle", "magnum", "glass", "jug", "can", "pint", "half_pint", "cup",
    "serving", "portion", "bowl", "plate", "platter", "each", "package", "session", "entry",
}
STATIONS = {"bar", "barista", "kitchen", "grill", "shisha", "door"}
# Union of the UK's 14 regulated allergens and the US "major 9".
ALLERGENS = {
    "gluten", "crustaceans", "eggs", "fish", "peanuts", "soybeans", "milk", "nuts", "celery",
    "mustard", "sesame", "sulphites", "lupin", "molluscs",
}
RECIPE_UNITS = {"ml", "g", "each", "dash", "leaf", "scoop", "slice"}

# Order categories appear in for each mode; categories not listed go last.
CATEGORY_ORDER = {
    "restaurant": [
        "Small Plates & Sharing", "Soups", "Mains", "Grills", "Sides", "Desserts", "Hot Drinks",
        "Mocktails", "Soft Drinks & Mixers", "Cocktails", "Wine", "Champagne & Sparkling",
        "Beer & Cider", "Whisky", "Cognac & Brandy", "Vodka", "Gin", "Rum", "Tequila & Mezcal",
        "Liqueurs & Bitters", "Entry & Tables",
    ],
    "nightclub": [
        "Bottle Service", "Champagne & Sparkling", "Cognac & Brandy", "Whisky", "Vodka",
        "Tequila & Mezcal", "Gin", "Rum", "Liqueurs & Bitters", "Shots", "Cocktails",
        "Beer & Cider", "Soft Drinks & Mixers", "Mocktails", "Grills", "Small Plates & Sharing",
        "Sides", "Entry & Tables", "Shisha",
    ],
    "bar": [
        "Beer & Cider", "Cocktails", "Shots", "Whisky", "Vodka", "Gin", "Rum", "Tequila & Mezcal",
        "Cognac & Brandy", "Liqueurs & Bitters", "Wine", "Champagne & Sparkling",
        "Soft Drinks & Mixers", "Mocktails", "Small Plates & Sharing", "Grills", "Sides",
    ],
    "lounge": [
        "Cocktails", "Shisha", "Champagne & Sparkling", "Wine", "Cognac & Brandy", "Whisky",
        "Tequila & Mezcal", "Vodka", "Gin", "Rum", "Liqueurs & Bitters", "Beer & Cider",
        "Mocktails", "Soft Drinks & Mixers", "Hot Drinks", "Small Plates & Sharing", "Grills",
        "Mains", "Desserts", "Bottle Service", "Entry & Tables",
    ],
}
# Categories that belong to an optional module: shown in the template but switched off until
# the business turns the module on.
MODULE_CATEGORIES = {"Shisha": ("shisha", False), "Entry & Tables": ("door", True), "Bottle Service": ("bottle_service", True)}


def split(value):
    return [v for v in value.split("|") if v] if value else []


def load_items(errors):
    items = {}
    with open(HERE / "library-items.csv", newline="", encoding="utf-8") as f:
        for line_no, row in enumerate(csv.DictReader(f), start=2):
            where = f"library-items.csv:{line_no} ({row.get('id')})"
            if row["id"] in items:
                errors.append(f"{where}: duplicate id")
            row["markets"] = MARKETS if row["markets"] == "ALL" else split(row["markets"])
            for field in ("modes", "starter_in", "pack", "sell_units", "allergens"):
                row[field] = split(row[field])
            checks = [
                (row["item_type"] in ITEM_TYPES, f"unknown item_type '{row['item_type']}'"),
                (set(row["markets"]) <= set(MARKETS), f"unknown market in {row['markets']}"),
                (row["modes"] and set(row["modes"]) <= set(MODES), f"bad modes {row['modes']}"),
                (set(row["starter_in"]) <= set(row["modes"]), "starter_in must be within modes"),
                (row["pack"] and set(row["pack"]) <= PACKS, f"bad pack {row['pack']}"),
                (set(row["sell_units"]) <= SELL_UNITS, f"bad sell_units {row['sell_units']}"),
                (row["station"] in STATIONS, f"unknown station '{row['station']}'"),
                (set(row["allergens"]) <= ALLERGENS, f"unknown allergen in {row['allergens']}"),
                (row["category"], "missing category"),
            ]
            if row["item_type"] == "ingredient":
                checks.append((not row["starter_in"] and not row["sell_units"], "ingredients are stock-only"))
            else:
                checks.append((row["sell_units"], "sellable items need sell_units"))
            errors.extend(f"{where}: {msg}" for ok, msg in checks if not ok)
            items[row["id"]] = row
    return items


def load_recipes(items, errors):
    recipes = defaultdict(list)
    with open(HERE / "recipes.csv", newline="", encoding="utf-8") as f:
        for line_no, row in enumerate(csv.DictReader(f), start=2):
            where = f"recipes.csv:{line_no}"
            item, ing = items.get(row["item_id"]), items.get(row["ingredient_id"])
            if not item:
                errors.append(f"{where}: unknown item '{row['item_id']}'")
                continue
            if not ing:
                errors.append(f"{where}: unknown ingredient '{row['ingredient_id']}'")
                continue
            if item["item_type"] not in RECIPE_TYPES:
                errors.append(f"{where}: '{item['id']}' is not a recipe item")
            if row["unit"] not in RECIPE_UNITS:
                errors.append(f"{where}: unknown unit '{row['unit']}'")
            missing = set(item["markets"]) - set(ing["markets"])
            if missing:
                errors.append(f"{where}: '{ing['id']}' not available in {sorted(missing)} where '{item['id']}' is sold")
            recipes[row["item_id"]].append({"ingredient": row["ingredient_id"], "qty": float(row["qty"]), "unit": row["unit"]})
    for item in items.values():
        if item["item_type"] in RECIPE_TYPES and item["id"] not in recipes and "Batch" not in item["notes"]:
            errors.append(f"recipe missing for '{item['id']}'")
    return recipes


def recipe_allergens(item, items, recipes):
    found = set(item["allergens"])
    for line in recipes.get(item["id"], []):
        found |= set(items[line["ingredient"]]["allergens"])
    return sorted(found)


def build_templates(items, recipes):
    templates = {}
    for code, mode in MODES.items():
        templates[mode] = {}
        for market in MARKETS:
            by_category = defaultdict(list)
            for item in items.values():
                if code in item["starter_in"] and market in item["markets"]:
                    by_category[item["category"]].append(item["id"])
            order = CATEGORY_ORDER[mode] + sorted(set(by_category) - set(CATEGORY_ORDER[mode]))
            categories = []
            for name in order:
                if not by_category.get(name):
                    continue
                entry = {"name": name, "items": by_category[name]}
                if name in MODULE_CATEGORIES:
                    entry["module"], entry["enabled_by_default"] = MODULE_CATEGORIES[name]
                categories.append(entry)
            library_size = sum(1 for i in items.values() if market in i["markets"] and code in i["modes"] and i["item_type"] != "ingredient")
            templates[mode][market] = {
                "starter_item_count": sum(len(c["items"]) for c in categories),
                "library_item_count": library_size,
                "categories": categories,
            }
    return templates


def write_outputs(items, recipes, templates):
    defaults = json.loads((HERE / "country-defaults.json").read_text(encoding="utf-8"))
    derived = {
        item_id: {"allergens": recipe_allergens(items[item_id], items, recipes), "recipe": lines}
        for item_id, lines in sorted(recipes.items())
    }
    out = {
        "version": 1,
        "generated_by": "catalog/build_catalog.py",
        "markets": {m: defaults[m] for m in MARKETS},
        "recipes": derived,
        "templates": templates,
    }
    (HERE / "menu-templates.json").write_text(json.dumps(out, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    lines = [
        "# NightOps Starter Menus",
        "",
        "_Generated by `catalog/build_catalog.py` from `library-items.csv`. Do not edit by hand._",
        "",
        "Each new venue starts with the menu for its **mode** and **country**. Prices are blank: the business sets them.",
        "Anything not listed here can be added from the full NightOps Library (`library-items.csv`), or created as the business's own item.",
        "",
        "| Market | " + " | ".join(m.title() for m in MODES.values()) + " | Library items |",
        "|---|" + "---|" * (len(MODES) + 1),
    ]
    for market in MARKETS:
        counts = [str(templates[mode][market]["starter_item_count"]) for mode in MODES.values()]
        library = sum(1 for i in items.values() if market in i["markets"] and i["item_type"] != "ingredient")
        lines.append(f"| {MARKET_LABELS[market]} | " + " | ".join(counts) + f" | {library} |")
    for market in MARKETS:
        lines += ["", f"## {MARKET_LABELS[market]}"]
        for mode in MODES.values():
            t = templates[mode][market]
            lines += ["", f"### {mode.title()}: {t['starter_item_count']} starter items", ""]
            for cat in t["categories"]:
                names = ", ".join(items[i]["name"] for i in cat["items"])
                flag = " _(optional module, off until switched on)_" if cat.get("enabled_by_default") is False else ""
                lines.append(f"- **{cat['name']}**{flag}: {names}")
    (HERE / "starter-menus.md").write_text("\n".join(lines) + "\n", encoding="utf-8")


def main():
    errors = []
    items = load_items(errors)
    recipes = load_recipes(items, errors)
    if errors:
        print("Catalog has problems:", *errors, sep="\n  ")
        sys.exit(1)
    templates = build_templates(items, recipes)
    write_outputs(items, recipes, templates)
    sellable = sum(1 for i in items.values() if i["item_type"] != "ingredient")
    print(f"OK: {len(items)} library entries ({sellable} sellable), {len(recipes)} recipes, "
          f"{len(MODES) * len(MARKETS)} starter menus written.")


if __name__ == "__main__":
    main()
