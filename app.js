const imagesArea = document.querySelector(".images");
const gallery = document.querySelector(".gallery");
const galleryHeader = document.querySelector(".gallery-header");
const searchBtn = document.getElementById("search-btn");
const sliderBtn = document.getElementById("create-slider");
const sliderContainer = document.getElementById("sliders");
// selected image
let sliders = [];

// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = "15674931-a9d714b6e9d654524df198e00&q";


// Get images 
const getImages = (query) => {
  toggleSpinner(); //Bonus item : Loading spinner function call before loading images
  fetch(`https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`)
    .then((response) => response.json())
    .then((data) => showImages(data.hits)) // Bug 01: Type error fixed : hitS -> hits
    .catch((err) => console.log(err));
};


// Show images 
const showImages = (images) => {
  imagesArea.style.display = "block";
  gallery.innerHTML = "";
  // Show gallery title
  galleryHeader.style.display = "flex";
  images.forEach((image) => {
    let div = document.createElement("div");
    div.className = "col-lg-3 col-md-4 col-xs-6 img-item mb-2";
    div.innerHTML = `
     <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
    gallery.appendChild(div);

  });
  toggleSpinner(); //Bonus item : Loading spinner function call after loading images

};


// Image select and deselect                                    // Bug 05: Select and deselect Image
let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  element.classList.toggle("added"); //Replaced add() function with toggle()

  let item = sliders.indexOf(img);
  if (item === -1) {
    sliders.push(img);
  }
};


// --Create Slider --//
var timer;
const createSlider = () => { // Bug 02: Create Slider
  // check slider image length
  if (sliders.length < 2) {
    alert("Select at least 2 image.");
    return;
  }
  // Create slider previous next area
  sliderContainer.innerHTML = "";
  const prevNext = document.createElement("div");
  prevNext.className =
    "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext);
  document.querySelector(".main").style.display = "block";

  //    Hide image aria 
  imagesArea.style.display = "none";
  const duration = document.getElementById("duration").value || 1000;
  sliders.forEach((slide) => {
    let item = document.createElement("div");
    item.className = "slider-item";
    item.innerHTML = `<img class="w-100"
    src="${slide}"
    alt="">`;
    sliderContainer.appendChild(item);
  });
  changeSlide(0);

  // Slider Duration fix 
  if (duration >= 1000) {                                            // Bug 03: negative time handling
    timer = setInterval(function () {
      slideIndex++;
      changeSlide(slideIndex);
    }, duration);
  } else if (duration < 0) {
    alert("Sorry!! Timer cannot be negative.. Try again.");
    timer = setInterval(function () {
      slideIndex++;
      changeSlide(slideIndex);
    }, 1000);
  } else if (duration >= 500 || duration < 500 || duration < 600 || duration < 700 || duration < 800 || duration < 900) {
    confirm("Are You want to speed up slider change??");
    timer = setInterval(function () {
      slideIndex++;
      changeSlide(slideIndex);
    }, duration);
  }
};

// Change slider index
const changeItem = (index) => {
  changeSlide((slideIndex += index));
};

// Change slider item 
const changeSlide = (index) => {
  const items = document.querySelectorAll(".slider-item");
  if (index < 0) {
    slideIndex = items.length - 1;
    index = slideIndex;
  }

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach((item) => {
    item.style.display = "none";
  });

  items[index].style.display = "block";
};

searchBtn.addEventListener("click", function () {
  document.querySelector(".main").style.display = "none";
  clearInterval(timer);
  const search = document.getElementById("search");
  getImages(search.value);
  sliders.length = 0;
});


sliderBtn.addEventListener("click", function () {
  createSlider();
});


// SearchBox clickHandler for keyboard enter button 
var input = document.getElementById("search"); // Bug 04: Added keyboard enter features
input.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById("search-btn").click();
  }
});


//  Loading sign 
const toggleSpinner = () => {
  const spinner = document.getElementById('loading-spinner');
  spinner.classList.toggle('d-lg-none');
}