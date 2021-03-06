import {Article} from './Models/Article';
import {Box} from './Models/Box';
import enquirer from 'inquirer';

const MAX_CAPACITY = 10;
const SEPARATOR = '/';


/**
 * Permet d'optimiser le rangement des articles dans les cartons
 * @param articles les articles à ranger
 * @returns liste de cartons
 */
function bestBox(articles: Article[]): Box[] {
    //Chaque article dans un carton
    const boxes: Box[] = [];
    articles.forEach(article => {
        let box: Box = {items: '', space: MAX_CAPACITY};
        box.space = MAX_CAPACITY - article.size;
        box.items = article.size.toString();
        boxes.push(box);
    })
    let indexArticle = 0;
    for (const article of articles) {
        boxes[indexArticle].space += article.size;
        boxes[indexArticle].items = (boxes[indexArticle].items).replace(article.size.toString(), '');
        let sizeMaxBox = 0;
        let indexBoxMax = 0;

        boxes.forEach((box: Box, indexBox: number) => {
            if (article.size <= box.space && MAX_CAPACITY - box.space + article.size >= sizeMaxBox) {
                sizeMaxBox = MAX_CAPACITY - box.space + article.size;
                indexBoxMax = indexBox;
                //si un carton est rempli, on passe à l'article suivant
                if (sizeMaxBox === MAX_CAPACITY) return true;
            }

        })
        //on affecte l'article au meilleur carton
        boxes[indexBoxMax].space -= article.size;
        boxes[indexBoxMax].items = boxes[indexBoxMax].items.concat(article.size.toString());
        indexArticle++;
    }


    return boxes.filter(box => box.space < MAX_CAPACITY);
}

/**
 * Transforme la chaine de caractères saisie par l'utilisateur en articles
 * @param string chaine de caractères saisie par l'utilisateur
 * @returns une liste d'articles
 */
function transformStringInArticles(string: string): Article[] {
    const articles: Article[] = [];


    [...string].forEach((char: string) => {
        let article: Article = {size: 0};
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
    let result: string = '';

    if (!boxes) {
        result = '0 carton';
    } else {
        boxes.forEach((box: Box) => {
            result = result.concat(box.items + SEPARATOR);
        })
        result = result.concat(` => ${boxes.length} cartons`);

    }
    return result;
}

async function manageBoxes() {
    const MESSAGE = 'Veuillez saisir une suite de chiffres compris entre 1 et 9 (ex: 185943)';
    let input: string = '';
    const pattern: string = '^[1-9]+$';


    let response = await enquirer.prompt({message: MESSAGE, name: 'question', type: 'input'});
    input = response.question;

    if (!input.match(pattern)) {
        do {
            console.log('Format invalide');
            response = await enquirer.prompt({message: MESSAGE, name: 'question', type: 'input'});
            input = response.question;
        } while (!input.match(pattern))
    }
    const articles: Article[] = transformStringInArticles(input);
    const boxes: Box[] = bestBox(articles);
    console.log(displayResult(boxes))
}

manageBoxes();