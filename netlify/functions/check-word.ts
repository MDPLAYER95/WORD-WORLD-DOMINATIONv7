import { Handler } from "@netlify/functions";

const handler: Handler = async (event) => {
  // Validation de la requête entrante
  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing body" }),
    };
  }

  let parsedBody;
  try {
    parsedBody = JSON.parse(event.body);
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid JSON in request body" }),
    };
  }

  const { word, previousWords, currentWord, language = 'fr' } = parsedBody;

  if (!word || !Array.isArray(previousWords) || typeof currentWord !== "string") {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing or invalid required fields" }),
    };
  }

  // Vérification de la clé API
  if (!process.env.OPENAI_API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Missing OpenAI API key" }),
    };
  }

  const languagePrompts = {
    fr: "LE JEU SE DEROULE EN FRANÇAIS, donc tu ne réponds qu'en FRANÇAIS.",
    en: "THE GAME IS IN ENGLISH, so you only respond in ENGLISH.",
    de: "DAS SPIEL IST AUF DEUTSCH, also antwortest du nur auf DEUTSCH.",
    es: "EL JUEGO ESTÁ EN ESPAÑOL, así que solo respondes en ESPAÑOL.",
    it: "IL GIOCO È IN ITALIANO, quindi rispondi solo in ITALIANO."
  };

  try {
    // Appel à l'API OpenAI
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `${languagePrompts[language]}

# But du jeu :
L'utilisateur doit proposer un mot qui "bat" le mot précédent en respectant les règles définies ci-dessous.
Le jeu est infini, mais chaque mot soumis doit être unique.

# Règles pour qu'un mot batte le précédent :
- Interaction logique :
  Le nouveau mot doit avoir une capacité démontrable à détruire, casser, neutraliser, supplanter, corrompre, ou tuer l'ancien mot, dans un contexte physique, conceptuel, émotionnel, social, relationnel, ou naturel. La relation entre les mots doit être cohérente et applicable.
- Supériorité fonctionnelle :
  Le nouveau mot doit être plus performant, avancé ou efficace que l'ancien dans son usage, ses capacités, ou son fonctionnement. La supériorité doit s'appliquer à l'objectif ou à la fonction principale de l'ancien mot.
- Interaction humaine ou sociale :
  Les relations de pouvoir, d'influence ou d'émotion peuvent permettre à un concept ou une personne de surpasser un autre dans un contexte social, économique ou relationnel, uniquement si cette influence est pertinente et logique.
- Philosophique ou conceptuel :
  Une idée ou un concept peut transcender ou annuler un autre sur le plan moral, philosophique, ou cognitif, uniquement si cette annulation est logiquement défendable.
- Temporalité et destruction progressive :
  Le temps ou des forces naturelles peuvent surpasser ou détruire un concept, un objet ou une idée, mais cela doit être inévitable et applicable dans la réalité.
- Mort :
  La mort transcende ou annule tout concept vivant ou matériel, sauf si le nouveau mot représente une solution ou une opposition directe (par exemple : "immortalité").

# Règles pour qu'un mot échoue à battre le précédent :
- Infériorité conceptuelle ou fonctionnelle :
  Le nouveau mot est manifestement moins avancé, moins performant, ou inapproprié pour interagir avec l'ancien.
- Non-adaptabilité au contexte :
  Le mot soumis n'est pas adapté pour guérir, détruire, manipulé, surpassé etc... l'ancien mot.
- Abstraction excessive :
  Le nouveau mot est trop vague ou n'a aucun lien clair avec le précédent.
- Doublon :
  Le mot a déjà été utilisé par l'utilisateur dans une interaction précédente.

# Système d'évaluation :
Tu dois toujours analyser le mot proposé selon les critères ci-dessus.
Si le mot est accepté, le jeu continue avec ce nouveau mot comme référence.
Si le mot est refusé, le jeu reste sur le mot précédent.

# Gestion des doublons :
Vérifie si le mot soumis a déjà été donné par l'utilisateur pour éviter toute répétition.
Association d'un emoji :

# Chaque mot soumis doit être associé à un emoji descriptif et pertinent.

# Contexte actuel du jeu :
Mot précédent : ["${currentWord}"]
"mots_deja_donnes_par_utilisateur": ${JSON.stringify(previousWords)}

# Format de réponse attendu (JSON) :
Fait attention au contexte conditionnel, qui permet de considérer si une situation exceptionnelle ou contextuelle peut inverser une relation logique normale.
Réponds toujours dans ce format standardisé, qu'il y ait un succès ou un échec.
Format de réponse attendu (JSON) :

{
 "explication_pour_ou_contre" : "[expliquer en moins de 15 mots pourquoi le mot bat ou ne bat pas l'ancien]",
 "mot_precedent": "[mot precedent]",
 "mot_soumis_par_utilisateur": "[le mot soumis]",
 "smiley_correspondant_au_mot": "[emoji associé au mot]",
 "mot_deja_utiliser_precedement": [true/false],
 "succes": [true/false]
}`
          },
          {
            role: "user",
            content: word,
          },
        ],
        temperature: 0.65,
        max_tokens: 100,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: data.error || "Error from OpenAI API" }),
      };
    }

    if (!data.choices || data.choices.length === 0) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "No choices returned by OpenAI" }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: data.choices[0].message.content,
    };
  } catch (error) {
    console.error("Error communicating with OpenAI:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to check word" }),
    };
  }
};

export { handler };