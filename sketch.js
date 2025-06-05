// Variáveis globais para os inputs e botões
let cropInput, areaInput, dateInput;
let seedPriceInput, fertPriceInput, salePriceInput;
let submitButton, exportButton;

// Lista de registros e mensagem ao usuário
let records = [];
let message = "";

// Função principal 
function setup() {
  createCanvas(800, 600); // Cria a área de desenho 
  textFont('Arial');      // Define a fonte
  textSize(14);           // Tamanho da fonte
  textAlign(LEFT, TOP);   // Alinhamento do texto
  background(245);        // Cor de fundo

  createForm();           // Cria os elementos do formulário
}

// Função que desenha na tela continuamente 
function draw() {
  background(245);        // Limpa e redesenha o fundo
  drawFormTitle();        // Título da seção
  displayMessage();       // Mostra a mensagem de erros e sucessos
  displayRecords();       // Lista os registros cadastrados
  displayStats();         // Mostra estatísticas totais
}

// Criação dos elementos de interface (inputs e botões)
function createForm() {
  createElement('h2', '📋 Registro de Plantio - Agricultor Conectado');

  // Inputs para cultura, área e data
  cropInput = createInput().attribute('placeholder', 'Nome da cultura (ex: Milho)');
  areaInput = createInput().attribute('placeholder', 'Área plantada (hectares)');
  dateInput = createInput().attribute('placeholder', 'Data de plantio (ex: 23/04/2025)');

  // Inputs para os preços e valor de venda
  seedPriceInput = createInput().attribute('placeholder', 'Preço da semente por ha (R$)');
  fertPriceInput = createInput().attribute('placeholder', 'Preço do fertilizante por ha (R$)');
  salePriceInput = createInput().attribute('placeholder', 'Valor de venda por ha (R$)');

  // Botões
  submitButton = createButton('Salvar Registro');
  exportButton = createButton('📥 Exportar Dados');

  // Lista de todos os inputs para aplicar estilo
  let inputs = [
    cropInput, areaInput, dateInput,
    seedPriceInput, fertPriceInput, salePriceInput,
    submitButton, exportButton
  ];

  // Estilo visual para os inputs
  for (let input of inputs) {
    input.style('margin', '5px');
    input.style('padding', '6px');
    input.style('font-size', '14px');
  }

  // Ações dos botões
  submitButton.mousePressed(handleSubmit); // Quando clicar em "Salvar"
  exportButton.mousePressed(exportData);   // Quando clicar em "Exportar"

  createElement('hr'); // Linha horizontal
}

// Desenha o título na tela
function drawFormTitle() {
  fill(50);
  textSize(16);
  text("🌱 Registros do Agricultor", 20, 200);
}

// Exibe mensagens ao usuário de erro ou sucesso
function displayMessage() {
  fill(message.includes("⚠️") ? 'red' : 'green');
  textSize(14);
  text(message, 20, 230);
}

// Processa e salva os dados quando clicar no botão
function handleSubmit() {
  // Coleta os dados dos inputs
  let crop = cropInput.value().trim();
  let area = parseFloat(areaInput.value());
  let dateStr = dateInput.value().trim();
  let dateObj = parseBrazilianDate(dateStr);

  // Coleta e converte os valores numéricos dos preços
  let seedPrice = parseFloat(seedPriceInput.value());
  let fertPrice = parseFloat(fertPriceInput.value());
  let salePrice = parseFloat(salePriceInput.value());

  // Verifica se todos os dados estão corretos
  if (!crop || isNaN(area) || !dateObj ||
      isNaN(seedPrice) || isNaN(fertPrice) || isNaN(salePrice)) {
    message = "⚠️ Preencha todos os campos corretamente!";
    return;
  }

  // Calcula lucro de acordo com os valores fornecidos
  let custoPorHectare = seedPrice + fertPrice;
  let lucroPorHectare = salePrice - custoPorHectare;
  let lucroTotal = lucroPorHectare * area;

  // Salva os dados no array de registros
  records.push({
    crop,
    area,
    date: dateObj,
    dateStr,
    lucroTotal
  });

  sortRecordsByDate(); // Organiza por data

  // Limpa os dados e mostra mensagem de sucesso
  cropInput.value('');
  areaInput.value('');
  dateInput.value('');
  seedPriceInput.value('');
  fertPriceInput.value('');
  salePriceInput.value('');
  message = "✅ Registro salvo com sucesso!";
}

// Converte data (dd/mm/aaaa) 
function parseBrazilianDate(dateStr) {
  let parts = dateStr.split('/');
  if (parts.length === 3) {
    let day = parseInt(parts[0]);
    let month = parseInt(parts[1]) - 1;
    let year = parseInt(parts[2]);
    let date = new Date(year, month, day);
    return isNaN(date.getTime()) ? null : date;
  }
  return null;
}

// Organiza as datas da mais nova para a mais antiga
function sortRecordsByDate() {
  records.sort((a, b) => b.date - a.date);
}

// Retorna emoji baseado na cultura
function getCropEmoji(crop) {
  let lower = crop.toLowerCase();
  if (lower.includes("milho")) return "🌽";
  if (lower.includes("soja")) return "🌱";
  if (lower.includes("trigo")) return "🌾";
  if (lower.includes("feijão")) return "🌰";
  return "🌿"; // Padrão
}

// Exibe os registros salvos
function displayRecords() {
  let y = 260;
  for (let rec of records) {
    fill(0);
    text(`• ${getCropEmoji(rec.crop)} ${rec.crop} | ${rec.area} ha | Plantado em: ${rec.dateStr} | Lucro: R$ ${rec.lucroTotal.toFixed(2)}`, 20, y);
    y += 20;
  }
}

// Mostra estatísticas finais na tela (área total e lucro)
function displayStats() {
  let totalArea = 0;
  let totalLucro = 0;

  // Soma o total de área e o lucro
  for (let rec of records) {
    totalArea += rec.area;
    totalLucro += rec.lucroTotal;
  }

  fill(30, 100, 30);
  textSize(14);
  text(`📊 Área total plantada: ${totalArea.toFixed(2)} hectares`, 20, height - 60);
  text(`💰 Lucro total estimado: R$ ${totalLucro.toFixed(2)}`, 20, height - 40);
}

// Exporta os registros para um arquivo CSV direto para o computador
function exportData() {
  let data = ["Cultura,Área (ha),Data,Lucro (R$)"];
  for (let rec of records) {
    data.push(`${rec.crop},${rec.area},${rec.dateStr},${rec.lucroTotal.toFixed(2)}`);
  }
  saveStrings(data, 'registros_agricolas.csv');
}
