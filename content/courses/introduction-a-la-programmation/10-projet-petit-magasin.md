# Projet : la caisse du petit magasin

> **Objectif** : à la fin de ce projet, tu as écrit un programme complet qui lit un panier, calcule le total avec remise et livraison, et affiche un vrai ticket de caisse. Tu y as réutilisé les variables, les conditions, les boucles, les fonctions, les listes et les dictionnaires.

## L'idée

Tu as construit ce petit magasin morceau par morceau : le prix d'un article, la remise, le total d'un panier, les fonctions, le catalogue. Il est temps de **tout assembler**. Contrairement aux exercices précédents, personne ne te dit quelle instruction écrire : tu as la liste de ce que le programme doit faire, à toi de choisir comment.

Laisse-toi un temps de lutte : c'est normal de bloquer, et c'est ce moment qui fait vraiment progresser. Si tu es vraiment coincé·e, regarde d'abord les **indices**, puis seulement ensuite le corrigé.

## Le cahier des charges

Le ticket doit ressembler à ceci pour le panier de départ :

```plaintext
===== PETIT MAGASIN =====
pomme x10 : 5.00 €
pain x5 : 6.00 €
lait x12 : 13.20 €
fromage x3 : 14.40 €
cafe x4 : 14.00 €
-------------------------
Sous-total : 52.60 €
Remise : -5.26 €
Livraison : offerte
À PAYER : 47.34 €
```

Les règles du magasin :

- **le catalogue** : pomme 0,50 €, pain 1,20 €, lait 1,10 €, fromage 4,80 €, café 3,50 € ;
- **la remise** : 10 % dès 50 € d'achats, 20 % dès 100 € (celle du chapitre 4) ;
- **la livraison** : offerte dès 40 €, **après remise** ; sinon elle coûte 4,90 € ;
- les prix sont affichés avec **deux décimales**.

Le panier de départ :

- 10 pommes, 5 pains, 12 laits, 3 fromages, 4 cafés.

## Les étapes

Avance dans l'ordre. **Teste chaque étape avant de passer à la suivante** : c'est la méthode du chapitre 9.

**Étape 1 : les données.** Écris le catalogue (un dictionnaire : nom de l'article → prix) et le panier (une liste de dictionnaires, un par ligne : `nom` et `quantite`).

**Étape 2 : le sous-total d'une ligne.** Écris une fonction qui reçoit une ligne du panier et **renvoie** son prix (prix du catalogue × quantité). Teste-la avec une ligne : 10 pommes doivent faire 5.

**Étape 3 : le total du panier.** Écris une fonction qui reçoit le panier et **renvoie** la somme des sous-totaux, avec une boucle et un accumulateur. Pour le panier de départ, tu dois trouver 52.6.

**Étape 4 : la remise.** Écris une fonction qui reçoit un total et **renvoie le taux de remise** (0, 0.1 ou 0.2). Teste-la avec les valeurs limites : 49.99, 50, 99.99 et 100.

**Étape 5 : la livraison.** Écris une fonction qui reçoit le total après remise et **renvoie les frais de livraison** (0 ou 4.9). Teste les valeurs limites 39.99 et 40.

**Étape 6 : le ticket.** Écris une fonction qui **affiche** le ticket en réutilisant toutes les précédentes : une ligne par article (boucle), puis le sous-total, la remise, la livraison et le montant à payer.

## Un outil de plus : afficher deux décimales

Pour afficher `5.00 €` plutôt que `5 €`, on **formate** le nombre :

- en JavaScript : `prix.toFixed(2)` renvoie un texte avec 2 décimales ;
- en Python, dans une f-string : `f"{prix:.2f}"`.

Par exemple, `(5).toFixed(2)` en JavaScript et `f"{5:.2f}"` en Python donnent tous les deux `5.00`.

## Indices

Ouvre-les un par un, et seulement si tu es bloqué·e sur l'étape correspondante.

- **Étape 2** : dans une ligne, `ligne["nom"]` (ou `ligne.nom`) donne le nom de l'article. Cherche ce nom dans le catalogue pour obtenir le prix.
- **Étape 3** : c'est le même schéma qu'au chapitre 5 (l'accumulateur) et qu'au chapitre 8 (le panier). Prépare `total = 0` avant la boucle.
- **Étape 4** : tu as déjà écrit les conditions de la remise au chapitre 4. Pense à tester le cas **le plus grand en premier**.
- **Étape 5** : « dès 40 € » signifie `>= 40`, pas `> 40` : relis le bug du chapitre 9.
- **Étape 6** : calcule d'abord `total`, puis `remise = total * taux`, puis `apresRemise = total - remise`, puis la livraison **sur `apresRemise`**. Le montant à payer est `apresRemise + livraison`.

## Pour aller plus loin

Quand ton ticket est conforme, améliore-le, une idée à la fois :

1. **N'affiche la ligne « Remise » que s'il y a une remise.** Sinon, le ticket affiche `Remise : -0.00 €`, ce qui est étrange.
2. **Gère un article inconnu** : si le nom n'est pas dans le catalogue, n'arrête pas le programme ; ignore la ligne et affiche un message (chapitre 8).
3. **Teste un petit panier** : 2 pommes et 1 pain. La livraison doit être de 4,90 € et il n'y a pas de remise : tu dois trouver 7,10 € à payer.
4. **Ajoute un jour de promotion** : par exemple, une variable `jourDePromo` qui, quand elle est vraie, ajoute 5 % de remise.

## Corrigé

Il y a mille façons de le faire. Voici une solution complète qui suit les étapes, avec la première amélioration (la ligne « Remise » n'apparaît que s'il y a une remise).

```javascript
const catalogue = { pomme: 0.5, pain: 1.2, lait: 1.1, fromage: 4.8, cafe: 3.5 };

const panier = [
  { nom: "pomme", quantite: 10 },
  { nom: "pain", quantite: 5 },
  { nom: "lait", quantite: 12 },
  { nom: "fromage", quantite: 3 },
  { nom: "cafe", quantite: 4 },
];

function sousTotal(ligne) {
  return catalogue[ligne.nom] * ligne.quantite;
}

function totalPanier(panier) {
  let total = 0;
  for (const ligne of panier) {
    total = total + sousTotal(ligne);
  }
  return total;
}

function tauxRemise(total) {
  if (total >= 100) {
    return 0.2;
  } else if (total >= 50) {
    return 0.1;
  }
  return 0;
}

function fraisDeLivraison(total) {
  if (total >= 40) {
    return 0;
  }
  return 4.9;
}

function afficherTicket(panier) {
  console.log("===== PETIT MAGASIN =====");
  for (const ligne of panier) {
    console.log(
      `${ligne.nom} x${ligne.quantite} : ${sousTotal(ligne).toFixed(2)} €`,
    );
  }

  const total = totalPanier(panier);
  const remise = total * tauxRemise(total);
  const apresRemise = total - remise;
  const livraison = fraisDeLivraison(apresRemise);

  console.log("-------------------------");
  console.log(`Sous-total : ${total.toFixed(2)} €`);
  if (remise > 0) {
    console.log(`Remise : -${remise.toFixed(2)} €`);
  }
  if (livraison === 0) {
    console.log("Livraison : offerte");
  } else {
    console.log(`Livraison : ${livraison.toFixed(2)} €`);
  }
  console.log(`À PAYER : ${(apresRemise + livraison).toFixed(2)} €`);
}

afficherTicket(panier);
```

```python
catalogue = {"pomme": 0.5, "pain": 1.2, "lait": 1.1, "fromage": 4.8, "cafe": 3.5}

panier = [
    {"nom": "pomme", "quantite": 10},
    {"nom": "pain", "quantite": 5},
    {"nom": "lait", "quantite": 12},
    {"nom": "fromage", "quantite": 3},
    {"nom": "cafe", "quantite": 4},
]


def sous_total(ligne):
    return catalogue[ligne["nom"]] * ligne["quantite"]


def total_panier(panier):
    total = 0
    for ligne in panier:
        total = total + sous_total(ligne)
    return total


def taux_remise(total):
    if total >= 100:
        return 0.2
    elif total >= 50:
        return 0.1
    return 0


def frais_de_livraison(total):
    if total >= 40:
        return 0
    return 4.9


def afficher_ticket(panier):
    print("===== PETIT MAGASIN =====")
    for ligne in panier:
        print(f"{ligne['nom']} x{ligne['quantite']} : {sous_total(ligne):.2f} €")

    total = total_panier(panier)
    remise = total * taux_remise(total)
    apres_remise = total - remise
    livraison = frais_de_livraison(apres_remise)

    print("-------------------------")
    print(f"Sous-total : {total:.2f} €")
    if remise > 0:
        print(f"Remise : -{remise:.2f} €")
    if livraison == 0:
        print("Livraison : offerte")
    else:
        print(f"Livraison : {livraison:.2f} €")
    print(f"À PAYER : {apres_remise + livraison:.2f} €")


afficher_ticket(panier)
```

Ce que ce programme met en œuvre, chapitre par chapitre :

- **variables** : `total`, `remise`, `apresRemise`, `livraison` ;
- **conditions** : `tauxRemise`, `fraisDeLivraison`, l'affichage de la livraison offerte ;
- **boucles** : le total du panier et l'affichage de chaque ligne ;
- **fonctions** : chaque règle du magasin est une petite fonction qu'on peut tester seule ;
- **listes** : le panier ;
- **dictionnaires** : le catalogue, et chaque ligne du panier.

Pour la deuxième vérification (2 pommes et 1 pain), le ticket affiche un sous-total de 2.20 €, une livraison de 4.90 € et un total à payer de 7.10 €, sans ligne de remise.

## Et maintenant ?

Si tu es arrivé·e jusqu'ici en ayant vraiment cherché les exercices, **tu sais programmer** : tu peux lire un programme simple, le suivre à la main, et en écrire un qui résout un problème concret. Les langages changeront, les idées, non.

Pour continuer, deux directions naturelles :

- **creuser un langage** : les parcours *JavaScript de zéro* et *Python pour débuter* reprennent ces notions en profondeur, avec davantage d'exercices ;
- **comprendre ce qu'il y a sous le capot d'Internet** : les modules sur les protocoles (le *handshake* TCP, HTTP...) expliquent comment deux ordinateurs se parlent, avec des schémas animés.

Reviens aussi dans quelques jours refaire les quiz de ce cours, sans regarder les corrigés : c'est la meilleure façon de ne pas oublier.
