<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:template match="/">
<html>
<head>
    <title>Movie Database</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 20px;
            background: #f0f2f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        h1 {
            color: #1a237e;
            text-align: center;
            margin-bottom: 30px;
        }
        .movie-table {
            width: 100%;
            border-collapse: collapse;
            background: white;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
            border-radius: 10px;
            overflow: hidden;
        }
        .movie-table th {
            background: #1a237e;
            color: white;
            padding: 15px;
            text-align: left;
        }
        .movie-table td {
            padding: 15px;
            border-bottom: 1px solid #ddd;
        }
        .movie-table tr:hover {
            background: #f5f5f5;
        }
        .actors-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .actors-list li {
            margin-bottom: 5px;
        }
        .query-section {
            margin-top: 40px;
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        .query-section h2 {
            color: #1a237e;
            margin-bottom: 20px;
        }
        .query-result {
            background: #f5f5f5;
            padding: 15px;
            border-radius: 5px;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Movie Database</h1>
        
        <table class="movie-table">
            <tr>
                <th>ID</th>
                <th>Movie Title</th>
                <th>Director</th>
                <th>Year</th>
                <th>Actors</th>
            </tr>
            <xsl:for-each select="movies/movie">
            <tr>
                <td><xsl:value-of select="@id"/></td>
                <td><xsl:value-of select="movieTitle"/></td>
                <td><xsl:value-of select="director"/></td>
                <td><xsl:value-of select="year"/></td>
                <td>
                    <ul class="actors-list">
                        <xsl:for-each select="actors/actor">
                            <li><xsl:value-of select="."/></li>
                        </xsl:for-each>
                    </ul>
                </td>
            </tr>
            </xsl:for-each>
        </table>

        <div class="query-section">
            <h2>XPath Query Results</h2>
            
            <h3>All Movie Titles:</h3>
            <div class="query-result">
                <xsl:for-each select="movies/movie/movieTitle">
                    <div><xsl:value-of select="."/></div>
                </xsl:for-each>
            </div>

            <h3>Director of the Second Movie:</h3>
            <div class="query-result">
                <xsl:value-of select="movies/movie[2]/director"/>
            </div>

            <h3>Actors of the Fourth Movie:</h3>
            <div class="query-result">
                <xsl:for-each select="movies/movie[4]/actors/actor">
                    <div><xsl:value-of select="."/></div>
                </xsl:for-each>
            </div>
        </div>
    </div>
</body>
</html>
</xsl:template>
</xsl:stylesheet>
