
// ==========================================
// T06-1: Histogram filter buttons
// ==========================================

const populateFilters = (data) => {

    const filterContainer = d3.select("#filters_screen");

    filterContainer.selectAll("button")
        .data(filters_screen, d => d.id)
        .join("button")
        .attr("type", "button")
        .attr("class", d => `filter${d.isActive ? " active" : ""}`)
        .attr("aria-pressed", d => String(d.isActive))
        .text(d => d.label)
        .on("click", (event, selectedFilter) => {

            // Update the active filter.
            filters_screen.forEach(filter => {
                filter.isActive = filter.id === selectedFilter.id;
            });

            // Update button appearance.
            filterContainer.selectAll("button")
                .attr("class", d =>
                    `filter${d.isActive ? " active" : ""}`
                )
                .attr("aria-pressed", d => String(d.isActive));

            // Update histogram.
            updateHistogram(selectedFilter.id, data);
        });
};


// ==========================================
// Update histogram according to filter
// ==========================================

const updateHistogram = (filterId, data) => {

    if (!innerChartH) return;

    const updatedData = filterId === "all"
        ? data
        : data.filter(d =>
            String(d.screenTech).trim().toUpperCase() ===
            filterId.toUpperCase()
        );

    renderHistogramBins(updatedData);
};


// ==========================================
// T06-2: Create scatterplot tooltip
// ==========================================

const createTooltip = () => {

    // Append tooltip group to the scatterplot.
    tooltipS = innerChartS.append("g")
        .attr("class", "scatter-tooltip")
        .style("opacity", 0);

    // Tooltip background rectangle.
    tooltipS.append("rect")
        .attr("class", "tooltip-background")
        .attr("width", tooltipWidth)
        .attr("height", tooltipHeight)
        .attr("rx", 6);

    // Tooltip text.
    tooltipS.append("text")
        .attr("class", "tooltip-text")
        .attr("x", 10)
        .attr("y", 22);
};


// ==========================================
// Handle scatterplot mouse events
// ==========================================

const handleMouseEvents = () => {

    innerChartS.selectAll(".scatter-point")

        // Mouse enters a data point.
        .on("mouseenter", function(event, d) {

            const circle = d3.select(this);

            const cx = +circle.attr("cx");
            const cy = +circle.attr("cy");

            // Keep the tooltip inside the chart area.
            const tooltipX = Math.max(
                0,
                Math.min(cx + 10, innerWidthS - tooltipWidth)
            );

            const tooltipY = Math.max(
                0,
                Math.min(cy - tooltipHeight - 10,
                    innerHeightS - tooltipHeight)
            );

            // Display screen size.
            tooltipS.select(".tooltip-text")
                .text(`Screen size: ${d.screenSize} inches`);

            // Position and show tooltip.
            tooltipS
                .attr(
                    "transform",
                    `translate(${tooltipX},${tooltipY})`
                )
                .transition()
                .duration(150)
                .style("opacity", 1);

            // Highlight the selected point.
            circle
                .transition()
                .duration(150)
                .attr("r", 7)
                .attr("opacity", 1);
        })

        // Mouse leaves a data point.
        .on("mouseleave", function() {

            // Hide tooltip.
            tooltipS
                .transition()
                .duration(150)
                .style("opacity", 0);

            // Restore point appearance.
            d3.select(this)
                .transition()
                .duration(150)
                .attr("r", 5)
                .attr("opacity", 0.5);
        });
};
