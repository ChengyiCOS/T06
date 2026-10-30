
// ==========================================
// Load and process TV dataset
// ==========================================

d3.csv("data/Ex6_TVdata.csv", d => {

    // Use star if available; otherwise use star2.
    const starValue =
        d.star && d.star.trim() !== ""
            ? d.star
            : d.star2;

    return {
        brand: d.brand,
        model: d.model,

        screenSize:
            d.screenSize && d.screenSize.trim() !== ""
                ? +d.screenSize
                : NaN,

        screenTech: String(d.screenTech || "").trim(),

        energyConsumption:
            d.energyConsumption &&
            d.energyConsumption.trim() !== ""
                ? +d.energyConsumption
                : NaN,

        star:
            starValue && starValue.trim() !== ""
                ? +starValue
                : NaN
    };

}).then(data => {

    // Keep records suitable for the histogram.
    const validData = data.filter(d =>
        Number.isFinite(d.energyConsumption) &&
        d.screenTech.length > 0
    );

    if (validData.length === 0) {
        throw new Error(
            "The CSV loaded, but no valid energy consumption data was found."
        );
    }

    console.log("Loaded TV data:", validData);

    console.log(
        "Screen technologies:",
        [...new Set(validData.map(d => d.screenTech))]
    );

    // ======================================
    // Initialise T06-1 histogram
    // ======================================

    drawHistogram(validData);

    // Create histogram filter buttons.
    populateFilters(validData);

    // ======================================
    // Initialise T06-2 scatterplot
    // ======================================

    drawScatterplot(validData);

}).catch(error => {

    console.error("Error loading the CSV file:", error);

    d3.select("#histogram")
        .append("p")
        .attr("class", "error-message")
        .text(
            "The TV dataset could not be loaded. Check that " +
            "data/Ex6_TVdata.csv exists and that you are running " +
            "the page through a local web server."
        );

});
