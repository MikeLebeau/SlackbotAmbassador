# Slackbot Ambassador

## Description
Voici `Bobby` notre bot ambassadeur qui est là pour nous aider à 
désigner les prochains ambassadeurs, nous rappeler qui sont les ambassadeurs actuels
etc.

## Comment le setuper
> Les teams:  
> `> cp resources/teams.js.template resources/teams.js`  
> Edite moi ce fichier pour renseigner les équipes et leur membres

> Le state:  
> `> cp resources/state.js.template resources/state.js`  
> Edite moi ce fichier pour renseigner l'état actuel des ambassadeurs, à savoir les ambassadeurs actuels et ceux de la semaine dernière etc.  
> :warning: Ce n'est pas obligatoire, c'est uniquement si tu n'utilise pas de google sheet :warning: 

> Les variables d'environnement:  
> `> cp resources/env.js.template resources/env.js`  
> Edite moi ce fichier pour renseigner les variables d'environnements  
> Check la partie Environnement pour voir où trouver toute ces infos

## Environnement
> SLACK_BOT_TOKEN: "testToken"
> 
> Après t'être créé une app sur api.slack.com...  
> api.slack.com > ton app > OAuth & Permissions > Bot User OAuth Token

> SLACK_SIGNING_SECRET: "testSecret"  
>  
> api.slack.com > ton app > Basic Information > App Credentials > Signing Secret

> SLACK_APP_TOKEN: "testTokenApp"
>
> api.slack.com > ton app > Basic Information > App-Level Tokens > Tokens

> SPREADSHEET_ID: "TheSpreadSheetID"
>
> Dans ton fichier google Sheet, dans l'url:  
> docs.google.com/spreadsheets/d/<ICI LA C'EST L'ID>/edit

> GOOGLE_API_MAIL: "slack@bot.ambassador"  
> GOOGLE_API_KEY: "-----BEGIN PRIVATE KEY-----GAAAAAAAAAADDDDAAAAAMNN-----END PRIVATE KEY-----\n"  
>
> Les plus relous...  
> Dans la console de dev Google Cloud (https://console.cloud.google.com/home/dashboard),  
> Une fois que tu auras créé ton projet, clique sur `API et Services` puis va dans `Identifiants`  
> Puis clique sur `+ CRÉER DES IDENTIFIANTS`  
> Puis `Compte de service` et download le fichier  
> Et les infos sont dans ce fichier (`client_email` et `private_key`)


## Commande
> /ambassadeur  
> Donne la liste des ambassadeurs actuels

> /ambassadeur next  
> Désigne les heureux élus pour la semaine prochaine

> /ambassadeur next [teamName]  
> Désigne un nouvel ambassadeur pour allez dans cette équipe

## Reste à faire
- [ ] Rendre les messages visible par tout le monde pour certaine commande
- [ ] Ameliorer la recupe des info (Rendre ca plus flexible)
- [ ] Mettre le bot sur serveur et ajouter un cron
- [ ] Ajouter la gestion du non online (Enfin faire un truc mieux que là)
- [ ] Mettre a jour les templates...
