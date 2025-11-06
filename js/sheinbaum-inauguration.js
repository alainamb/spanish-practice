// Sheinbaum Speech - Verb Identification Practice

// Global variable to track current state
let isRevealed = false;

// The original text without highlighting
const originalText = `
    <p>
        <i>El 2 de junio de este año, el pueblo de México de forma democrática y pacífica dijo fuerte y claro: es tiempo de transformación y es tiempo de mujeres.</i>
    </p>
    <p>
        <i>Hoy, 1° de octubre de 2024 inicia el segundo piso de la Cuarta Transformación de la vida pública y también hoy después de 200 años de la república y de 300 años de la colonia, porque previo a ello no tenemos registros claros, es decir después de al menos 503 años, por primera vez llegamos las mujeres a conducir los destinos de nuestra hermosa nación. Digo llegamos, porque no llego sola, llegamos todas.</i>
    </p>
    <p>
        <i>México es un país maravilloso con un pueblo extraordinario, somos una gran nación. Aquí crecieron culturas originarias que dieron al mundo el maíz, el cacao, el jitomate, que construyeron pirámides monumentales, que entendieron los astros, la vida y la muerte como parte de un cambio constante, que nos dieron y siguen dando lenguas vivas como ninguna otra, que tejieron y tejen textiles con manos de mujeres artesanas que entrelazan con el alma y con la vida, con culturas como la Maya que crearon el cero como parte de la matemática, o la Mexica que creó el método más sustentable de cultivo que se conoce: la chinampa. México es el país que le dio al mundo a Hidalgo, que inició con unos cuantos el grito de Independencia y al poco tiempo fueron miles que demandaban justicia, él que abolió la esclavitud, él que supo conducir con certeza a su pueblo por el camino de la libertad y se convirtió en padre de la patria.</i>
    </p>
    <p>
        <i>Soy madre, abuela, científica y mujer de fe, y a partir de hoy, por voluntad del pueblo de México, la Presidenta constitucional de los Estados Unidos Mexicanos.</i>
    </p>
    <p>
        <i>Gobernaré para todos y para todas, y tengan la certeza de que pondré mi conocimiento, mi fuerza, mi historia y mi vida misma al servicio del pueblo y de la patria.</i>
    </p>
    <p>
        <i>Tengo la certeza de que consolidaremos juntas y juntos un México cada día más próspero, libre, democrático, soberano y justo. No les voy a defraudar. Les convoco a seguir haciendo historia.</i>
    </p>
    <p>
        <i>¡Que viva México!</i>
    </p>
`;

// The highlighted text with verb conjugations marked
const highlightedText = `
    <p>
        <i>El 2 de junio de este año, el pueblo de México de forma democrática y pacífica dijo fuerte y claro: <mark>es</mark> tiempo de transformación y <mark>es</mark> tiempo de mujeres.</i>
    </p>
    <p>
        <i>Hoy, 1° de octubre de 2024 <mark>inicia</mark> el segundo piso de la Cuarta Transformación de la vida pública y también hoy después de 200 años de la república y de 300 años de la colonia, porque previo a ello no tenemos registros claros, es decir después de al menos 503 años, por primera vez <mark>llegamos</mark> las mujeres a conducir los destinos de nuestra hermosa nación. Digo <mark>llegamos</mark>, porque no <mark>llego</mark> sola, <mark>llegamos</mark> todas.</i>
    </p>
    <p>
        <i>México <mark>es</mark> un país maravilloso con un pueblo extraordinario, <mark>somos</mark> una gran nación. Aquí crecieron culturas originarias que dieron al mundo el maíz, el cacao, el jitomate, que construyeron pirámides monumentales, que entendieron los astros, la vida y la muerte como parte de un cambio constante, que nos dieron y siguen dando lenguas vivas como ninguna otra, que tejieron y tejen textiles con manos de mujeres artesanas que <mark>entrelazan</mark> con el alma y con la vida, con culturas como la Maya, que crearon el cero como parte de la matemática, o la Mexica que creó el método más sustentable de cultivo que se conoce: la chinampa. México <mark>es</mark> el país que le dio al mundo a Hidalgo, que inició con unos cuantos el grito de Independencia y al poco tiempo fueron miles que demandaban justicia él que abolió la esclavitud, él que supo conducir con certeza a su pueblo por el camino de la libertad y se convirtió en padre de la patria.</i>
    </p>
    <p>
        <i><mark>Soy</mark> madre, abuela, científica y mujer de fe, y a partir de hoy, por voluntad del pueblo de México, la Presidenta constitucional de los Estados Unidos Mexicanos.</i>
    </p>
    <p>
        <i>Gobernaré para todos y para todas, y tengan la certeza de que pondré mi conocimiento, mi fuerza, mi historia y mi vida misma al servicio del pueblo y de la patria.</i>
    </p>
    <p>
        <i>Tengo la certeza de que consolidaremos juntas y juntos un México cada día más próspero, libre, democrático, soberano y justo. No les voy a defraudar. Les <mark>convoco</mark> a seguir haciendo historia.</i>
    </p>
    <p>
        <i>¡Que viva México!</i>
    </p>
`;

// Initialize the app
function initializeApp() {
    // Display the original text
    displayText(false);
}

// Display text based on reveal state
function displayText(revealed) {
    const textBox = document.getElementById('textBox');
    const revealBtn = document.getElementById('revealBtn');
    
    if (!textBox || !revealBtn) {
        return;
    }
    
    if (revealed) {
        textBox.innerHTML = highlightedText;
        revealBtn.textContent = 'Reset';
        isRevealed = true;
    } else {
        textBox.innerHTML = originalText;
        revealBtn.textContent = 'Reveal';
        isRevealed = false;
    }
}

// Toggle between reveal and reset
function toggleReveal() {
    displayText(!isRevealed);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Make function globally available
window.toggleReveal = toggleReveal;