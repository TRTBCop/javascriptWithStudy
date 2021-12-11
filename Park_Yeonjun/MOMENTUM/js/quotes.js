const quotes =[
    {
        quote: "If You Are Working On Somthing That You Really Care About, You Don't Have To Be Pushed The Vision Pulls You.",
        author: "Steve Jobs",
        },
        {
        quote: "We May Encounter Many Defeats Byt We must Not Be Defeated.",
        author: "Maya Angelou",
        },
        {
        quote:"Knowing Is Not Enough; We must Apply. Wishing Is Not Enough; We Must Do.",
        author: "Johann Wolfgang Von Goethe",
        },
    
];

const quote = document.querySelector("#quote span:first-child");
const author = document.querySelector("#quote span:last-child");


const todayQuote = quotes[Math.floor(Math.random() * quotes.length)];

quote.innerText = todayQuote.quote;
author.innerText = todayQuote.author;