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

    const width = 850;
    const height = 550;

    let svg = d3.select(".tree-diagram")
    .append("svg")
    .attr("id", "tree-diagram")
    .attr("viewBox", `0 0 ${width + 100} ${height + 100}`)
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
            .attr("data-value", d => d.data.value)
            .style("fill", d => colorScale(d.data.category))
            .on("mouseover", (event,d) => {
                let format = (dataSet.title == "Kickstarter Pledges") ?
                d3.format(",.0f") :
                d3.format("$,.2f");

                let value = format(d.data.value);

                tip.attr("data-value", value);
                tip.html(`${d.data.category}<br>${d.data.name}<br>${value}`);
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