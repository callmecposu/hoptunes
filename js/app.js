/* ********* 

  BTI225 – Assignment 05

  I declare that this assignment is my own work in accordance with
  Seneca Academic Policy. No part of this assignment has been
  copied manually or electronically from any other source
  (including web sites) or distributed to other students.

  Please update the following with your information:

  Name:       Maksym Volkovynskyi
  Student ID: 126867225
  Date:       2023/07/28
 
********* */

// All of our data is available on the global `window` object.
// Create local variables to work with it in this file.
var { artists, songs } = window;
var quotes;

// For debugging, display all of our data in the console. You can remove this later.
console.log({ artists, songs }, "App Data");

const buildMenu = async () => {
  const nav = document.querySelector("#menu");
  artists.forEach((artist) => {
    const artistBtn = document.createElement("button");
    artistBtn.setAttribute("id", artist.id);
    artistBtn.classList.add(
      "mx-3",
      "transition",
      "ease-in-out",
      "font-light",
      "hover:scale-110",
      "border-transparent",
      "border-b-2",
      "duration-300"
    );
    artistBtn.innerHTML = artist.name;
    artistBtn.addEventListener("click", () => {
      unsetSelectedArtist();
      artistBtn.classList.remove("border-transparent");
      artistBtn.classList.add("border-orange-600");
      showSelectedArtist(artist.id);
      showCardsByAnArtist(artist.id);
    });
    nav.appendChild(artistBtn);
  });
  // change edit song form's submission behavior
  var form = document.querySelector("#editSongForm");
  form.onsubmit = () => {
    console.log("form submitted");
    closeSongForm();
    console.log(form.title.value);
    console.log(form.duration.value);
    console.log(form.year.value);
    console.log(form.songId.value);
    console.log(form.artistId.value);
    // update data
    songs.forEach((s) => {
      if (s.id == form.songId.value) {
        s.title = form.title.value ? form.title.value : s.title;
        s.year = form.year.value ? form.year.value : s.year;
        s.duration = form.duration.value ? form.duration.value : s.duration;
      }
    });
    showCardsByAnArtist(form.artistId.value);
    return false;
  };
  // fetch quotes
  const res = await fetch("https://dummyjson.com/quotes");
  quotes = await res.json();
  quotes = quotes.quotes;
  console.log(quotes);
  // imitate click on first artist
  const a1Btn = document.querySelector("#a1");
  a1Btn.click();
};

const unsetSelectedArtist = () => {
  const nav = document.querySelector("#menu");
  for (let i = 0; i < nav.children.length; i++) {
    nav.children[i].classList.remove("border-orange-600");
    nav.children[i].classList.add("border-transparent");
  }
};

const showSelectedArtist = (artistID) => {
  const linkContainer = document.querySelector("#selected-artist");
  linkContainer.innerHTML = "";
  const artist = artists.filter((a) => a.id == artistID)[0];
  const artistName = document.createElement("span");
  artistName.innerHTML = artist.name;
  artistName.classList.add("mx-3", "text-bold", "text-2xl");
  linkContainer.appendChild(artistName);
  artist.links.forEach((link) => {
    const anchor = document.createElement("a");
    anchor.setAttribute("href", link.url);
    anchor.setAttribute("target", "_blank");
    anchor.innerHTML = link.name;
    anchor.classList.add("link");
    linkContainer.appendChild(anchor);
  });
  linkContainer.insertBefore(
    linkContainer.children[0],
    linkContainer.children[2]
  );
};

const showCardsByAnArtist = (artistID) => {
  const artistSongs = songs.filter((s) => s.artistID == artistID);
  const cardContainer = document.querySelector("#card-container");
  cardContainer.innerHTML = "";
  artistSongs.forEach((s) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = s.playerEmbedCode;
    const info = document.createElement("div");
    info.classList.add("info");
    info.innerHTML = `<p>${s.title}</p>
    <p class="albumName">${s.album.name} - ${s.year}</p>
    <p class="duration">${Math.floor(s.duration / 60)} min ${
      s.duration % 60
    } sec</p>
    <p class="text-xs mt-5"><i>${
      quotes[Math.floor(29 * Math.random())].quote
    }</i></p>`;
    card.appendChild(info);
    card.addEventListener("click", () => {
      showSongForm(s.id);
    });
    card.onmouseenter = () => {
      console.log(1);
      card.style.height = '480px';
    };
    card.onmouseleave = () => {
      console.log(2);
      card.style.height = "384px";
    };
    cardContainer.appendChild(card);
  });
};

const showSongForm = (songId) => {
  console.log(songId);
  var modal = document.querySelector(".modal");
  var modalContent = document.querySelector(".modal-content");
  modal.classList.remove("-z-10");
  modal.classList.add("z-10", "backdrop-blur-sm");
  modalContent.classList.remove("hidden");
  setTimeout(() => {
    modalContent.classList.remove("opacity-0");
  }, 100);
  var form = document.querySelector("#editSongForm");
  var song = songs.filter((s) => s.id == songId)[0];
  form.title.placeholder = song.title;
  form.year.placeholder = song.year;
  form.duration.placeholder = song.duration;
  form.songId.value = song.id;
  form.artistId.value = song.artistID;
};

const closeSongForm = () => {
  var modal = document.querySelector(".modal");
  var modalContent = document.querySelector(".modal-content");
  var form = document.querySelector("#editSongForm");
  modalContent.classList.add("opacity-0");
  setTimeout(() => {
    modalContent.classList.add("hidden");
    modal.classList.remove("backdrop-blur-sm", "z-10");
    setTimeout(() => {
      modal.classList.add("-z-10");
      form.title.value = "";
      form.year.value = "";
      form.duration.value = "";
      form.songId.value = "";
      form.artistId.value = "";
    }, 500);
  }, 500);
};

window.onclick = (e) => {
  var modal = document.querySelector(".modal");
  if (e.target == modal) {
    closeSongForm();
  }
};

document.addEventListener("DOMContentLoaded", buildMenu);
