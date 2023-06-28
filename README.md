#ENTÊTE
   
    Projet: Boutique Ahuntsic
    Codeurs: Joseph, Isabelle, Mathieu
    Cours : Programmation Web côté serveur (420-289-AH)

#PRENEZ NOTE

    For development purpose use paypal account: user="sb-fyyzh26379554@personal.example.com" password="paypal123" for approval
    Dépot github publique: https://github.com/notLorne/tpStore2

#LANCER L'APPLICATION

    cd backend
    nodemon

#ÉNONCÉ

    À remettre le 27 juin 2023 avant 23h59 | Équipe de 2 (40%)
    TP2 : Boutique Ahuntsic

    Introduction
    Vous devez construire une application web en utilisant les concepts de RestAPI qui permettra de
    gérer une boutique en ligne vendant les articles de votre choix (vêtements, articles de piscine,
    articles de bureau etc.). Voici la liste des fonctionnalités requises :

    Cas 1 : Modéliser et implémenter le SGBD (20 points)
    D’abord, il faut faire la modélisation de votre base de données SQL. Il faut tenir compte des
    exigences des autres cas afin de ne rien oublier. Une fois la modélisation complétée, il faudra
    produire le script qui permettra de créer tous vos objets de base de données.

    Cas 2 : Afficher les produits (20 points)
    Il s’agit ici d’afficher la liste de vos produits (au moins 10, sous forme de tableau). Il doit y avoir
    au moins 7 champs décrivant le produit en question. Vous devez pouvoir afficher l’image de
    votre produit à l’écran.

    Cas 3 : Intégrer un module de paiement (20 points)
    Lorsqu’on a terminé d’ajouter nos articles au panier d’achat, il doit y avoir un bouton qui permet
    de payer nos articles. Pour ce faire, il faudra faire l’intégration avec l’API de Paypal. Vous devrez
    effectuer vos recherches et lire la documentation pour savoir comment l’utiliser.

    Cas 4 : Afficher les produits achetés par le client (20 points)
    On doit pouvoir garder la trace de tous les produits achetés par un client. Ici, il s’agit donc
    d’afficher une liste à l’écran (sous forme de tableau) de tous les produits ayant déjà été achetés
    par le client connecté.
    s
    Cas 5 : Authentification et Inscription (20 points)
    Il faut pouvoir s’authentifier à votre application ou pouvoir s’inscrire si l’on n’a pas de compte.
    Une fois connecté, il faut pouvoir garder en mémoire les articles déposés dans le panier d’achat,
    et ce, même lorsqu’on rafraichit la page (concept de session).

#TO DO

    Si vous ajouter un to do indiquer le dans le code et dans le readme.md
    TO REMOVE indique que ça doit être retirer avant la mise en prod    

#GIT INSTRUCTIONS FOR UPDATE FROM MAIN

    FROM TERMINAL:

    step 1:
    Ensure that you have the latest changes from the main branch by running the following commands in the terminal:
    
    git checkout main
    
    git pull origin main
    
    step 2:
    Switch to the branch you want to sync with the main branch by running the following command:
    git checkout branch-name
    
    "branch-name" = isabelle_branch, mathieu_branch, jospeh_branch
    
    step 3:
    Merge the changes from the main branch into your branch by running the following command:
    git merge main
    
    step 4:
    Push the updated branch to GitHub by running the following command:
    git push origin <branch-name>