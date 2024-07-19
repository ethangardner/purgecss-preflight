const purgeCSSOptions = {
    css: ["./*.css"],
    content: [
        "./*.{html,js}",
    ],
    defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
    safelist: [
        "pre",
        ".not-used-but-safelisted"
    ]
};

export default purgeCSSOptions;