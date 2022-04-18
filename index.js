const dataSets = {
    videoGames: {
        title: "Video Game Sales",
        description: "Top 100 Most Sold Video Games Grouped by Platform",
        url: "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json"
    },
    kickstarterPledges: {
        title: "Kickstarter Pledges",
        description: "Top 100 Most Pledged Kickstarter Campaigns Grouped By Category",
        url: "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json"
    },
    movies: {
        title: "Movie Sales",
        description: "Top 100 Highest Grossing Movies Grouped By Genre",
        url: "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json"
    }
}

const title = document.getElementById("title-text");
const description = document.getElementById("description-text");

let dataSet = dataSets.videoGames;

const drawMap = () => {

    const colorScale = d3.scaleOrdinal().range([
        "#1f77b4",
        "#aec7e8",
        "#ff7f0e",
        "#ffbb78",
        "#2ca02c",
        "#98df8a",
        "#d62728",
        "#ff9896",
        "#9467bd",
        "#c5b0d5",
        "#8c564b",
        "#c49c94",
        "#e377c2",
        "#f7b6d2",
        "#7f7f7f",
        "#c7c7c7",
        "#bcbd22",
        "#dbdb8d",
        "#17becf",
        "#9edae5"
    ]);

    let tip = d3.tip()
    .attr("class", "text-center")
    .attr("class", "card py-2 px-4")
    .attr("id", "tooltip")
    .offset([-10,0]);

    const width = 900; // 950
    const height = 550; // 700

    let svg = d3.select(".tree-diagram")
    .append("svg")
    .attr("id", "tree-diagram")
    .attr("viewBox", `0 0 ${width + 100} ${height + 150}`)
    .call(tip);

    d3.json(dataSet.url).then((data, error) => {
        if(error) {
            console.log(error);
        }
        else {
            let root = d3.hierarchy(data)
            .sum(d => {
                return d.value;
            });

            d3.treemap()
            .size([width, height])
            .padding(2)
            (root);

            svg.selectAll("rect")
            .data(root.leaves())
            .enter()
            .append("rect")
            .attr("x", d => d.x0 + 50)
            .attr("y", d => d.y0 + 25)
            .attr("width", d => d.x1 - d.x0)
            .attr("height", d => d.y1 - d.y0)
            .attr("class", "tile")
            .attr("data-name", d => d.data.name)
            .attr("data-category", d => d.data.category)
            .attr("data-value", d => {
                console.log(d.data.value)
                return d.data.value
            })
            .style("fill", d => colorScale(d.data.category))
            .on("mouseover", (event,d) => {
                let format = (dataSet.title == "Kickstarter Pledges") ?
                d3.format(",.0f") :
                d3.format("$,.2f");

                let value = format(d.data.value);

                tip.attr("data-value", d.data.value);
                tip.html(`${d.data.category}<br>${d.data.name}<br>${value}`);
                tip.show(event);
            })
            .on("mouseout", tip.hide);

            const categories = root.leaves()
            .map(nodes => nodes.data.category)
            .filter((category, index, categories) => {
                return categories.indexOf(category) == index;
            });

            let xLegend = (width + 100) / 2 - ((categories.length * 40)/2)

            const legend = svg.append("g")
            .attr("id", "legend")
            .attr("transform", `translate(${xLegend},600)`)

            legend.append("g")
            .selectAll("rect")
            .data(categories)
            .enter()
            .append("rect")
            .attr("x", (d, i) => i * 40)
            .attr("y", "20")
            .attr("width", "25")
            .attr("height", "25")
            .attr("fill", d => colorScale(d))
            .attr("class", "legend-item")
            .on("mouseover", (event,d) => {
                tip.html(`${d}`);
                tip.show(event);
            })
            .on("mouseout", tip.hide);
        }
    });
}

const changeDataSet = (button) => {
    dataSet = dataSets[button.value];
    title.innerHTML = dataSet.title;
    description.innerHTML = dataSet.description;
    d3.select("svg").remove();
    drawMap();
}

title.innerHTML = dataSet.title;
description.innerHTML = dataSet.description;
drawMap();