const buttonContainer = document.getElementById('button-container');
const cardContainer = document.getElementById("card-container");
const errorElement = document.getElementById("error-element");
const sortBtn = document.getElementById('sort-btn');
let selectedCategory = 1000;
let sortByView = false;
sortBtn.addEventListener('click', () => {
    sortByView = true;
    fetchDataByCategories(selectedCategory, sortByView);
})
const fetchCategory = async () => {
    const url = 'https://openapi.programming-hero.com/api/videos/categories';
    fetch(url)
        .then((res) => res.json())
        .then(({ data }) => {

            data.forEach(card => {
                const newBtn = document.createElement('button');
                newBtn.innerText = card.category;
                newBtn.className = "category-btn btn hover:bg-red-700 hover:text-white px-10 font-semibold";
                newBtn.addEventListener('click', () => {
                    fetchDataByCategories(card.category_id)
                    const allBtn = document.querySelectorAll(".category-btn")
                    for (const btn of allBtn) {
                        btn.classList.remove('bg-green-600');
                    }
                    newBtn.classList.add('bg-green-600');
                });
                buttonContainer.appendChild(newBtn);
            });
        })
}


const fetchDataByCategories = (id, sortByView) => {
    selectedCategory = id;
    // console.log(id);
    const url = `https://openapi.programming-hero.com/api/videos/category/${id}`;
    fetch(url)
        .then((res) => res.json())
        .then(({ data }) => {
            console.log(data);
            if (sortByView) {
                console.log(data);
                data.sort((a, b) => {
                    const totalViewStrFirst = a.others?.views;
                    const totalViewStrSecond = b.others?.views;
                    const totalViewFirstNumber = parseFloat(totalViewStrFirst.replace('K', '')) || 0;
                    const totalViewSecondNumber = parseFloat(totalViewStrSecond.replace('K', '')) || 0;
                    return totalViewSecondNumber - totalViewFirstNumber;
                })
            }
            if (data.length === 0) {
                errorElement.classList.remove('hidden');
            }
            else {
                errorElement.classList.add('hidden');
            }
            cardContainer.innerHTML = '';
            data.forEach(video => {
                console.log(video.others.posted_date)
                const milliSecond = parseFloat(video.others.posted_date);
                function msToTime(milliSecond) {

                    //Get hours from milliseconds
                    var hours = milliSecond / (1000 * 60 * 60);
                    var absoluteHours = Math.floor(hours);
                    var h = absoluteHours > 9 ? absoluteHours : '0' + absoluteHours;

                    //Get remainder from hours and convert to minutes
                    var minutes = (hours - absoluteHours) * 60;
                    var absoluteMinutes = Math.floor(minutes);
                    var m = absoluteMinutes > 9 ? absoluteMinutes : '0' + absoluteMinutes;

                    //Get remainder from minutes and convert to seconds
                    var seconds = (minutes - absoluteMinutes) * 60;
                    var absoluteSeconds = Math.floor(seconds);
                    var s = absoluteSeconds > 9 ? absoluteSeconds : '0' + absoluteSeconds;

                    return h + " hr " + m + " min " + s + " s "
                }
                
                let verifiedBadge = '';
                if (video.authors[0].verified) {
                    verifiedBadge = `<img src="demoVerified.png" alt="">`
                }
                const newCard = document.createElement('div');
                newCard.innerHTML = `
            <div class="card h-96 bg-base-100 shadow-xl">
            <figure><img src=${video.thumbnail} />
                             
            </figure>
            <div class="card-body ">
                <div class="flex gap-5">
                    <div>
                            <div  class="relative ${!milliSecond ? 'hidden' : '' } bottom-20 left-64 bg-gray-300 p-2 rounded-3xl">
                                ${msToTime(milliSecond)}
                            </div>
                        <img src=${video.authors[0].profile_picture} alt="" class="h-10 w-10 rounded-full">
                    </div>
                    <div class="space-y-3">
                        <h1 class="font-extrabold text-xl pb-3">${video.title}</h1>
                        <div class="flex gap-3 ">
                            <h2>${video.authors[0].profile_name}</h2>
                            ${verifiedBadge}
                        </div>
                        <p>${video.others.views}</p>
                    </div>
                </div>
            </div>

        </div>
            `


                cardContainer.appendChild(newCard);


            });
        })
}
fetchCategory();
fetchDataByCategories(selectedCategory, sortByView);