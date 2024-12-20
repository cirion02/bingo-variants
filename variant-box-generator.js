
function variantToElement(variant){
    let div = document.createElement("div");
    div.className = "variantBox";

    let name = document.createElement("h3");
    name.className = variant.color;
    name.innerText = variant.name;
    div.appendChild(name);

    let credit = document.createElement("div");
    credit.className = "credit";
    credit.innerText = "Creator: " + variant.credit;
    div.appendChild(credit);

    /*
    if (variant.short_desc) {
        let short_desc = document.createElement("div");
        short_desc.className = "short_desc";
        short_desc.innerText = variant.short_desc;
        div.appendChild(short_desc);
    }
    */

    let description = document.createElement("div");
    description.className = "description";
    description.innerHTML = "Description: " + variant.description;
    div.appendChild(description);

    if (variant.notes) {
        let notes = document.createElement("div");
        notes.className = "notes";
        notes.innerText = "Additional Notes: " + variant.notes;
        div.appendChild(notes);
    }

    if (variant.external_links) {
        for (let linkData of variant.external_links){
            if (linkData.link){
                let link = document.createElement("div");
                link.className = "link";
                link.innerHTML = `${linkData.name}: <a href="${linkData.link}">${linkData.link}</a>`;
                div.appendChild(link);
            }
            else if (linkData.file) {
                let link = document.createElement("div");
                link.className = "link";
                link.innerHTML = `${linkData.name}: <a href="${linkData.file}" download>Download</a>`;
                div.appendChild(link);
            }
        }
    }

    return div;
}

const VARIANT_COLORS = ["White", "Purple", "Blue", "Green", "Orange", "Red"];

function renderVariants(variant_list){
    for (let variant of variant_list){
        document.getElementById("holder").appendChild(variantToElement(variant))
    }
}

function addAllVariants(){
    let temp = variant_list_data;
    temp.sort(orderVariants);

    renderVariants(temp)
}

function addAllProgressions(){
    let temp = progression_list_data;
    temp.sort(orderVariants);

    renderVariants(temp)
}