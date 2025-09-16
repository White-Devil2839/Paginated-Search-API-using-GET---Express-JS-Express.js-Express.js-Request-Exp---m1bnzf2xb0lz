const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

// Already loaded the database (It's now a direct array)
const allArticles = JSON.parse(fs.readFileSync('./db.json', 'utf-8'));

app.get('/search', (req, res) => {


 let { name, limit, page } = req.query

 if(!name){
  res.status(400).json({ "error": "Search name parameter is required." });
 }

 limit= Number(limit);
 page=Number(page);

  let filtered = [...allArticles];

  if (name) {
    filtered = allArticles.filter(article =>
      article.title.toLowerCase().includes(name.toLowerCase())
    );
  }



  if (isNaN(limit) || limit <= 0) {
    limit = 5
  }
  if  (isNaN(page) || page <= 0){
    page = 1;
  }



  const totalPages = Math.ceil(filtered.length / limit);

  const start = (page - 1) * limit;
  const end = start + limit;

  const dataArr = filtered.slice(start, end);

  console.log("data",totalPages,start,end, page, dataArr )


  res.status(200).json({
    "currentPage": page,
    "totalPages": totalPages,
    "totalResults": filtered.length,
    "articles": dataArr

  })


});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = { app }
