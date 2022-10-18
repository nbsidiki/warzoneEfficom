"use stcrict"

let idTable = JSON.parse(localStorage.getItem("idTable")) ?? [];
let imageTable = JSON.parse(localStorage.getItem("imageTable")) ?? []

function showImage() {
    const person = document.querySelector("#personnageSelector").value
    if (document.querySelector('#perso')) {
        document.querySelector('#perso').src = `images/${person}.jpeg`
        localStorage.setItem('perso', person)
    }
    else {
        const image = document.createElement('img')
        image.src = `images/${person}.jpeg`
        image.className = "aperçu"
        image.id = "perso"
        document.querySelector('.inGame').appendChild(image)
        localStorage.setItem('perso', person)

    }

}
function insertCarte() {
    const person = localStorage.getItem('perso')
    if (person !== null) {
        const carteId = idTable.length > 0 ? parseInt(idTable[idTable.length - 1]?.split('-')[1]) + 1 : 1;
        document.querySelector('.inSession').innerHTML += `
        <div class="carte" id="carte-${carteId}" onmouseover="getIdTable()">
            <img src="images/${person}.jpeg" width="180" onmouseover="getIdImage()" alt="" id="${person}" class="imageCarte" >
            <div class='buttonsDiv' id='buttonsDiv-1' >
                <img class="icon" src="images/pen.png" alt="edit" onClick="editCarte()" ></img>
                <img class="icon" src="images/trash.png" alt="delete" id ="suppr-${carteId}" onClick="removeCarte()"></img>
            </div>
        </div>`
        imageTable = [...imageTable, `${person}`]
        idTable = [...idTable, `carte-${carteId}`]
        localStorage.setItem("idTable", JSON.stringify(idTable))
        localStorage.setItem("imageTable", JSON.stringify(imageTable))

    }
}

document.addEventListener("DOMContentLoaded", async () => {
    if (!localStorage.getItem('playing')) {
        document.querySelector('#start').addEventListener("click", () => {
            document.querySelector(".inGame").setAttribute("style", "display:flex")
            localStorage.setItem('playing', true)
            document.getElementById('start').remove()
            showImage()
        })
    } else {
        document.querySelector(".inGame").setAttribute("style", "display:flex")
        document.getElementById('start').remove()
    };

    showCarte();

});

function showCarte() {
    for (let i = 0; i < idTable.length; i++) {
        const carteIdTable = idTable[i];
        const imageId = imageTable[i]
        document.querySelector('.inSession').innerHTML += `
        <div class="carte" id="${carteIdTable}" onmouseover="getIdTable()">
            <img src="images/${imageId}.jpeg" width="180" onmouseover="getIdImage()"  alt="" id="${imageId}" class="imageCarte">
            <div class='buttonsDiv' id='buttonsDiv-1' >
                <img class="icon" src="images/pen.png" alt="edit" onClick="editCarte()" ></img>
                <img class="icon" src="images/trash.png" alt="delete" id ="suppr-${carteIdTable}" onClick="removeCarte()"></img>
            </div>
        </div>`
    }
}

function getIdTable() {
    for (let i = 0; i < idTable.length; i++) {
        const element = idTable[i];
        document.querySelector(`#${element}`)?.addEventListener('mouseover', () => {
            localStorage.setItem('carteId', idTable[i])
        })

    }
}

function getIdImage() {
    for (let i = 0; i < imageTable.length; i++) {
        const element = idTable[i];
        document.querySelector(`#${element}`)?.addEventListener('mouseover', () => {
            localStorage.setItem('imageId', imageTable[i])
        })

    }
}

function removeCarte() {
    const id = localStorage.getItem('carteId')
    document.querySelector(`#${id}`).remove()
    const index = idTable.indexOf(id)
    idTable.splice(index, 1)
    localStorage.setItem("idTable", JSON.stringify(idTable))
    imageTable.splice(index, 1)
    localStorage.setItem("imageTable", JSON.stringify(imageTable))


}
function editCarte() {
    if (!(localStorage.getItem("stillEdit"))) {

        localStorage.setItem("stillEdit", true)
        const id = localStorage.getItem('carteId')
        document.querySelector(`#${id}`).innerHTML += ` 
        <select name="selectPersonnage" id="personnageModifier">
        <option value="perso1">Perso1</option>
        <option value="perso2">Perso2</option>
        <option value="perso3">Perso3</option>
        <option value="perso4">Perso4</option>
        <option value="perso5">Perso5</option>
        </select>
        <img src="images/save.png"  alt="" width="30" id = "save2">
        `
        document.querySelector('#save2').addEventListener('click', () => {
            const person = document.querySelector('#personnageModifier').value
            document.querySelector(`#${localStorage.getItem('imageId')}`).src = `images/${person}.jpeg`

            document.querySelector('#personnageModifier').remove()
            document.querySelector('#save2').remove()
            localStorage.removeItem("stillEdit")
        })
    }
}

const camera_button = document.querySelector("#start-camera");
const canvas = document.querySelector("#canvas");
const click_button = document.querySelector("#click-photo");
const video = document.querySelector("#video");

camera_button.addEventListener('click', async function () {
    camera_button.setAttribute("style", "display:none")
    click_button.setAttribute("style", "display:flex")
    document.querySelector('.video').setAttribute("style", "display:flex")
    let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    video.srcObject = stream;
});

click_button.addEventListener('click', function () {
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    const image_data_url = canvas.toDataURL('image/jpeg');

    // mise en place du téléchargement automatique de l'image;
    downloadURI(image_data_url, "image.png")
    document.querySelector('#video').remove()
    click_button.remove()
    setInterval(() => {
        document.querySelector('#canvas')?.remove()
        document.querySelector('.video')?.remove()
    }, 5000);
});

const downloadURI = (uri, name) => {
    const link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    delete link;
}

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").then(registration => {
        console.log("SW Registered")
        console.log(registration)
    }).catch(error => {
        console.log("SW Registration Failed");
        console.log(error)
    })
}