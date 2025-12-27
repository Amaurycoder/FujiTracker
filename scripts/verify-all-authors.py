#!/usr/bin/env python3
import json
import sys

# Complete mapping based on user's list with source indicators (1=FujiWeekly, 2=Kevin Mullins, 3=Film.Recipes)
FUJIXWEEKLY_RECIPES = [
    "Kodachrome 64", "Reggie's Portra", "Kodak Portra 400 v2", "Pacific Blues",
    "Vibrant Arizona", "CineStill 800T", "Kodak Gold 200", "Kodak Tri-X 400",
    "McCurry Kodachrome", "California Summer", "Fujifilm Negative", "Reala Ace",
    "Classic Color", "Easy Reala Ace", "Vintage Kodachrome", "PRO Negative 160C",
    "Kodak Port ra 800 v3", "Universal Provia", "Velvia 100F (Univ.)", "Indoor Astia (Univ.)",
    "Elite Chrome (Univ.)", "Retro Negative (Univ.)", "Fuji Negative (Univ.)",
    "Pulled Negative (Univ)", "Superia 200 (Univ.)", "Americana Film (Univ)",
    "Eterna Film (Univ.)", "Chrome City (Univ.)", "Acros Negative (Univ)",
    "Kodak Portra 400 (X-T30)", "Standard Film (Dial)", "Velvia Film (Dial)",
    "Astia Summer (Dial)", "Kodak Film (Dial)", "Fuji PRO 160C (Dial)",
    "Superia Neg (Dial)", "Fuji PRO Film (Dial)", "Fuji PRO 160S (Dial)",
    "Cinematic Film (Dial)", "Reduced Bleach (Dial)", "Acros (Dial)",
    "Monochrome (Dial)", "Classic Chrome", "Kodak Ultramax 400", "Kodachrome II",
    "Bright Summer", "Fujicolor Super HG v2", "Kodak Portra 160", "CineStill 400D v2",
    "Kodak Vision3 250D", "Agfa Ultra 100", "Emulsion '86", "Summer of 1960",
    "Kodak Vericolor", "Nostalgic Americana", "Fujicolor 100 Ind.",
    "X-Trans III Classic Chrome", "Kodachrome I", "X-Trans II Portra", "Aerochrome v1",
    "PurpleChrome", "Vintage Bronze", "RedScale", "Bleach Bypass (Classic)",
    "Sepia (Classic)", "Kodak Portra 400"  # Added the original Portra 400
]

KEVIN_MULLINS_RECIPES = [
    "Cysgod", "Lighthouse", "Pure Grit", "Modern Movies", "Documentary Mono",
    "Documentary Colour", "Cinematic Mono", "Cinematic Colour", "Kodak Style (70s)",
    "Meyerowitz", "Parr (Punchy)", "HP4 Mono", "Pan F Mono", "Technicolor Warm",
    "Kodak Gold (Reala)", "Padilla (Grainy)", "Imai (Soft)", "50s Noir", "Newspaper"
]

FILM_RECIPES = [
    "Nightwalker", "Sunset Strip E6", "Underwood", "Gneiss Shot", "Rosa Golden",
    "Amber T200", "Spring Greens", "Oxygen", "Newsprint", "Lomochrome 92",
    "Barbour Green", "Brownout", "123 Chrome", "Absolute Portra"
]

recipes_path = 'src/data/recipes.json'

try:
    print('📖 Reading recipes.json...\n')
    with open(recipes_path, 'r', encoding='utf-8') as f:
        recipes = json.load(f)
    
    corrected_count = 0
    errors = []
    
    for recipe in recipes:
        recipe_name = recipe['name']
        current_author = recipe.get('author', 'N/A')
        correct_author = None
        
        if recipe_name in FUJIXWEEKLY_RECIPES:
            correct_author = 'FujiWeekly'
        elif recipe_name in KEVIN_MULLINS_RECIPES:
            correct_author = 'Kevin Mullins'
        elif recipe_name in FILM_RECIPES:
            correct_author = 'Film.Recipes'
        
        if correct_author and current_author != correct_author:
            print(f'✏️  Correcting "{recipe_name}": "{current_author}" → "{correct_author}"')
            recipe['author'] = correct_author
            corrected_count += 1
    
    if corrected_count > 0:
        print(f'\n💾 Writing corrections ({corrected_count} recipes updated)...')
        with open(recipes_path, 'w', encoding='utf-8') as f:
            json.dump(recipes, f, indent=2, ensure_ascii=False)
        print('✅ Done!')
    else:
        print('✅ All authors are already correct!')
    
    # Verification pass
    print('\n🔍 Verification...')
    incorrect = []
    for recipe in recipes:
        recipe_name = recipe['name']
        current_author = recipe.get('author', 'N/A')
        
        if recipe_name in FUJIXWEEKLY_RECIPES and current_author != 'FujiWeekly':
            incorrect.append(f'{recipe_name} → {current_author} (should be FujiWeekly)')
        elif recipe_name in KEVIN_MULLINS_RECIPES and current_author != 'Kevin Mullins':
            incorrect.append(f'{recipe_name} → {current_author} (should be Kevin Mullins)')
        elif recipe_name in FILM_RECIPES and current_author != 'Film.Recipes':
            incorrect.append(f'{recipe_name} → {current_author} (should be Film.Recipes)')
    
    if incorrect:
        print('\n⚠️  Still incorrect:')
        for item in incorrect:
            print(f'  - {item}')
    else:
        print('✅ All recipes from your list have correct authors!')
    
    sys.exit(0)
    
except Exception as e:
    print(f'❌ Error: {e}')
    import traceback
    traceback.print_exc()
    sys.exit(1)
