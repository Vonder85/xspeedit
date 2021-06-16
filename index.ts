import { Article } from "./Models/Article";
import { Box } from "./Models/Box";
import enquirer from 'inquirer';


const MAX_CAPACITY = 10;
const SEPARATOR = "/";


/**
 * Permet d'optimiser le rangement des articles dans les cartons
 * @param articles les articles à ranger
 * @returns liste de cartons
 */
function bestBox(articles: Article[]): Box[] {
    //Chaque article dans un carton
    let boxes: Box[] = [];
    articles.map(article => {
        let box = new Box();
        box.space = MAX_CAPACITY - article.size;
        box.items = article.size as unknown as string;
        boxes.push(box);
    })


    articles.map((article: Article, indexArticle: number) => {
        console.log(boxes)
        console.log(boxes[indexArticle].items);
        console.log(boxes[indexArticle].space);
        
        boxes[indexArticle].space += article.size;
        console.log(boxes[indexArticle].space);
        console.log(boxes[indexArticle].items);
        boxes[indexArticle].items = boxes[indexArticle].items.replace("".concat(article.size as unknown as string), "");
        console.log(boxes[indexArticle].items);
        console.log(boxes[indexArticle].space);
        let sizeMaxBox = 0;
        let indexBoxMax = 0;

        boxes.map((box: Box, indexBox: number) => {
            if (article.size <= box.space && MAX_CAPACITY - box.space + article.size >= sizeMaxBox) {
                sizeMaxBox = MAX_CAPACITY - box.space + article.size;
                indexBoxMax = indexBox;
                 //si un carton est rempli, on passe à l'article suivant
                if (sizeMaxBox === MAX_CAPACITY) return true;
            }

        })
        //on affecte l'article au meilleur carton
        boxes[indexBoxMax].space -= article.size;
        boxes[indexBoxMax].items += article.size;
    })

    //On élimine les cartons vides
    let boxsOk: Box[] = [];
    boxes.forEach(box => {
        if (box.space < MAX_CAPACITY) {
            boxsOk.push(box);
        }
    })

    return boxsOk;
}

/**
 * Transforme la chaine de caractères saisie par l'utilisateur en articles
 * @param string chaine de caractères saisie par l'utilisateur
 * @returns une liste d'articles
 */
function transformStringInArticles(string: string): Article[] {
    let articles: Article[] = [];

     
    [...string].map((char: string) => {
        let article = new Article();
        article.size = Number(char);
        articles.push(article);
    })
    return articles;
}

/**
 * Affiche le résultat obtenu
 * @param boxes cartons créés
 * @returns le résultat de l'algo
 */
function displayResult(boxes: Box[]): string {
    let result: string = "";

    if (!boxes) {
        result = "0 carton";
    } else {
        boxes.map((box: Box) => {
            result = box.items + SEPARATOR;
        })
        //on enlève le dernier "/"
        result.slice(result.length - 1, 1);
        result = ` => ${boxes.length} cartons`
    }

    return result;
}

async function manageBoxes() {
    const MESSAGE = "Veuillez saisir une suite de chiffres compris entre 1 et 9 (ex: 185943)";
    let input: string = "";
    let pattern: string = "^[1-9]+$";
    
   
        let response = await enquirer.prompt({ message: MESSAGE, name:"question", type: "input"});
        input = response.question;
    
    if (!input.match(pattern)) {
        do {
            console.log("Format invalide");
            response = await enquirer.prompt({ message: MESSAGE, name:"question", type: "input"});
            input = response.question;
            
        
    }while(!input.match(pattern))
    } else {
        const articles: Article[] = transformStringInArticles(input);
        const boxes: Box[] = bestBox(articles);
        displayResult(boxes);
    }
   
}

manageBoxes();