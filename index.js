const PORT = process.env.PORT || 8000
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express()

const newspapers = [
    {
        name: 'cityam',
        address: 'https://www.cityam.com/london-must-become-a-world-leader-on-climate-change-action/',
        base: ''
    },
    {
        name: 'thetimes',
        address: 'https://www.thetimes.co.uk/environment/climate-change',
        base: ''
    },
    {
        name: 'guardian',
        address: 'https://www.theguardian.com/environment/climate-crisis',
        base: '',
    },
    {
        name: 'telegraph',
        address: 'https://www.telegraph.co.uk/climate-change',
        base: 'https://www.telegraph.co.uk',
    },
    {
        name: 'nyt',
        address: 'https://www.nytimes.com/international/section/climate',
        base: '',
    },
    {
        name: 'latimes',
        address: 'https://www.latimes.com/environment',
        base: '',
    },
    {
        name: 'smh',
        address: 'https://www.smh.com.au/environment/climate-change',
        base: 'https://www.smh.com.au',
    },
    {
        name: 'un',
        address: 'https://www.un.org/climatechange',
        base: '',
    },
    {
        name: 'bbc',
        address: 'https://www.bbc.co.uk/news/science_and_environment',
        base: 'https://www.bbc.co.uk',
    },
    {
        name: 'es',
        address: 'https://www.standard.co.uk/topic/climate-change',
        base: 'https://www.standard.co.uk'
    },
    {
        name: 'sun',
        address: 'https://www.thesun.co.uk/topic/climate-change-environment/',
        base: ''
    },
    {
        name: 'dm',
        address: 'https://www.dailymail.co.uk/news/climate_change_global_warming/index.html',
        base: ''
    },
    {
        name: 'nyp',
        address: 'https://nypost.com/tag/climate-change/',
        base: ''
    }
]

const articles = []

newspapers.forEach(newspaper => {

    axios.get(newspaper.address).then((res) => {
        articles.push(...handleNewspaperData(newspaper, res))
    }).catch((err) => console.error(err))

})

function handleNewspaperData(newspaper, res) {
    const articlesArray = []
    const html = res.data
    const parser = cheerio.load(html)
    const x = parser('a:contains("climate")', html).each(function () {
        const title = parser(this).text().trim()
        const url = parser(this).attr('href')
        articlesArray.push(
            {
                title,
                url: newspaper.base + url,
                source: newspaper.name
            }
        )
    })
    return articlesArray
}

app.get('/', (request, response) => {
    response.json("welcome to my first API")
})

app.get('/news', (request, response) => {
    response.json(articles)
})

app.get('/news/:newspaperId', (request, response) => {

    const newspaperId = request.params.newspaperId
    const newspaper = newspapers.filter(newspaper => newspaper.name == newspaperId)[0]

    axios.get(newspaper.address).then((res) => {

        response.json(
            handleNewspaperData(newspaper, res)
        )
    }).catch((err) => console.error(err))

})

app.listen(PORT, () => { console.log('Server running on PORT ' + PORT) })
