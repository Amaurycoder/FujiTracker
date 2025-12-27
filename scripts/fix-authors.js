const fs = require('fs');
const path = require('path');

// Mapping recipe names to correct authors based on user's list
const RECIPE_AUTHOR_CORRECTIONS = {
    // FujiXWeekly recipes
    "Kodachrome 64": "FujiWeekly",
    "Reggie's Portra": "FujiWeekly",
    "Kodak Portra 400 v2": "FujiWeekly",
    "Pacific Blues": "FujiWeekly",
    "Vibrant Arizona": "FujiWeekly",
    "CineStill 800T": "FujiWeekly",
    "Kodak Gold 200": "FujiWeekly",
    "Kodak Tri-X 400": "FujiWeekly",
    "McCurry Kodachrome": "FujiWeekly",
    "California Summer": "FujiWeekly",
    "Fujifilm Negative": "FujiWeekly",
    "Reala Ace": "FujiWeekly",
    "Classic Color": "FujiWeekly",
    "Easy Reala Ace": "FujiWeekly",
    "Vintage Kodachrome": "FujiWeekly",
    "PRO Negative 160C": "FujiWeekly",
    "Kodak Portra 800 v3": "FujiWeekly",
    "Universal Provia": "FujiWeekly",
    "Velvia 100F (Univ.)": "FujiWeekly",
    "Indoor Astia (Univ.)": "FujiWeekly",
    "Elite Chrome (Univ.)": "FujiWeekly",
    "Retro Negative (Univ.)": "FujiWeekly",
    "Fuji Negative (Univ.)": "FujiWeekly",
    "Pulled Negative (Univ)": "FujiWeekly",
    "Superia 200 (Univ.)": "FujiWeekly",
    "Americana Film (Univ)": "FujiWeekly",
    "Eterna Film (Univ.)": "FujiWeekly",
    "Chrome City (Univ.)": "FujiWeekly",
    "Acros Negative (Univ)": "FujiWeekly",
    "Standard Film (Dial)": "FujiWeekly",
    "Velvia Film (Dial)": "FujiWeekly",
    "Astia Summer (Dial)": "FujiWeekly",
    "Kodak Film (Dial)": "FujiWeekly",
    "Fuji PRO 160C (Dial)": "FujiWeekly",
    "Superia Neg (Dial)": "FujiWeekly",
    "Fuji PRO Film (Dial)": "FujiWeekly",
    "Fuji PRO 160S (Dial)": "FujiWeekly",
    "Cinematic Film (Dial)": "FujiWeekly",
    "Reduced Bleach (Dial)": "FujiWeekly",
    "Acros (Dial)": "FujiWeekly",
    "Monochrome (Dial)": "FujiWeekly",
    "Classic Chrome": "FujiWeekly",
    "Kodak Ultramax 400": "FujiWeekly",
    "Kodak Portra 400": "FujiWeekly",
    "Kodachrome II": "FujiWeekly",
    "Bright Summer": "FujiWeekly",
    "Fujicolor Super HG v2": "FujiWeekly",
    "Kodak Portra 160": "FujiWeekly",
    "CineStill 400D v2": "FujiWeekly",
    "Kodak Vision3 250D": "FujiWeekly",
    "Agfa Ultra 100": "FujiWeekly",
    "Emulsion '86": "FujiWeekly",
    "Summer of 1960": "FujiWeekly",
    "Kodak Vericolor": "FujiWeekly",
    "Nostalgic Americana": "FujiWeekly",
    "Fujicolor 100 Ind.": "FujiWeekly",
    "X-Trans III Classic Chrome": "FujiWeekly",
    "Kodachrome I": "FujiWeekly",
    "X-Trans II Portra": "FujiWeekly",
    "Aerochrome v1": "FujiWeekly",
    "PurpleChrome": "FujiWeekly",
    "Vintage Bronze": "FujiWeekly",
    "RedScale": "FujiWeekly",
    "Bleach Bypass (Classic)": "FujiWeekly",
    "Sepia (Classic)": "FujiWeekly",

    // Kevin Mullins recipes
    "Cysgod": "Kevin Mullins",
    "Lighthouse": "Kevin Mullins",
    "Pure Grit": "Kevin Mullins",
    "Modern Movies": "Kevin Mullins",
    "Documentary Mono": "Kevin Mullins",
    "Documentary Colour": "Kevin Mullins",
    "Cinematic Mono": "Kevin Mullins",
    "Cinematic Colour": "Kevin Mullins",
    "Kodak Style (70s)": "Kevin Mullins",
    "Meyerowitz": "Kevin Mullins",
    "Parr (Punchy)": "Kevin Mullins",
    "HP4 Mono": "Kevin Mullins",
    "Pan F Mono": "Kevin Mullins",
    "Technicolor Warm": "Kevin Mullins",
    "Kodak Gold (Reala)": "Kevin Mullins",
    "Padilla (Grainy)": "Kevin Mullins",
    "Imai (Soft)": "Kevin Mullins",
    "50s Noir": "Kevin Mullins",
    "Newspaper": "Kevin Mullins",

    // Film.Recipes
    "Nightwalker": "Film.Recipes",
    "Sunset Strip E6": "Film.Recipes",
    "Underwood": "Film.Recipes",
    "Gneiss Shot": "Film.Recipes",
    "Rosa Golden": "Film.Recipes",
    "Amber T200": "Film.Recipes",
    "Spring Greens": "Film.Recipes",
    "Oxygen": "Film.Recipes",
    "Newsprint": "Film.Recipes",
    "Lomochrome 92": "Film.Recipes",
    "Barbour Green": "Film.Recipes",
    "Brownout": "Film.Recipes",
    "123 Chrome": "Film.Recipes",
    "Absolute Portra": "Film.Recipes",
};

const recipesPath = path.join(__dirname, '..', 'src', 'data', 'recipes.json');

try {
    console.log('📖 Reading recipes.json...');
    const data = fs.readFileSync(recipesPath, 'utf8');
    const recipes = JSON.parse(data);

    let correctedCount = 0;

    recipes.forEach(recipe => {
        const correctAuthor = RECIPE_AUTHOR_CORRECTIONS[recipe.name];
        if (correctAuthor && recipe.author !== correctAuthor) {
            console.log(`✏️  Correcting "${recipe.name}": "${recipe.author}" → "${correctAuthor}"`);
            recipe.author = correctAuthor;
            correctedCount++;
        }
    });

    if (correctedCount > 0) {
        console.log(`\n💾 Writing corrections (${correctedCount} recipes updated)...`);
        fs.writeFileSync(recipesPath, JSON.stringify(recipes, null, 2), 'utf8');
        console.log('✅ Done!');
    } else {
        console.log('✅ All authors are already correct!');
    }

} catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
}
