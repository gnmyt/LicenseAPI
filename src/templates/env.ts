export default `
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8"/>
    <meta name="viewport" content="width=device-width"/>
    <link rel="icon" href="https://i.imgur.com/Zu6wzbg.png" type="image/png"/>
    <title>LicenseAPI</title>
    <style type="text/css">
        body, html {
            font-family: sans-serif;
            color: #232835;
            background-color: #FEFEFE;
            padding: 0;
            margin: 0;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            text-align: center;
            gap: 1rem;
        }

         img {
            height: 4rem;
        }

        code {
            background-color: #d9d3d3;
            padding: 0.5rem;
            border-radius: 0.4rem;
        }

        p {
            margin: 0.5rem;
            font-size: 16pt;
        }
    </style>
</head>
<body>

<img src="https://i.imgur.com/4v0uPah.png" alt="MySpeed Logo"/>

<div class="explanation">
    <p>Your LicenseAPI instance is currently in development mode.</p>
    <p>Please change the <code>NODE_ENV</code> variable to <code>PRODUCTION</code>,</p>
    <p>and restart the server to disable this message.</p>
</div>

</body>
</html>`;