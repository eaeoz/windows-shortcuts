#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { createCanvas } = require('@napi-rs/canvas');
const PDFDocument = require('pdfkit');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const chokidar = require('chokidar');

// Komut satırı argümanlarını parse et
const argv = yargs(hideBin(process.argv))
  .option('all', {
    alias: 'a',
    type: 'boolean',
    description: 'Tüm çıktıları oluştur'
  })
  .option('wallpaper', {
    alias: 'w',
    type: 'boolean',
    description: 'Sadece masaüstü resmini oluştur'
  })
  .option('pdf', {
    alias: 'p',
    type: 'boolean',
    description: 'Sadece PDF oluştur'
  })
  .option('html', {
    alias: 'h',
    type: 'boolean',
    description: 'Sadece HTML oluştur'
  })
  .option('watch', {
    alias: 'W',
    type: 'boolean',
    description: 'data.json değişikliklerini izle'
  })
  .option('output', {
    alias: 'o',
    type: 'string',
    description: 'Çıktı klasörü',
    default: './output'
  })
  .help()
  .alias('help', 'h')
  .argv;

// Verileri yükle
function loadData() {
  try {
    const rawData = fs.readFileSync(path.join(__dirname, 'data.json'), 'utf8');
    return JSON.parse(rawData);
  } catch (error) {
    console.error('❌ data.json yüklenemedi:', error.message);
    process.exit(1);
  }
}

// Masaüstü resmi oluştur
async function createWallpaper(data) {
  console.log('🎨 Masaüstü resmi oluşturuluyor...');
  
  const { wallpaper } = data.layouts;
  const { meta, sections } = data;
  const { width, height } = wallpaper;
  
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  // Arka plan
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#0d1117');
  gradient.addColorStop(1, '#161b22');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  // Çerçeve
  ctx.strokeStyle = meta.colors.primary;
  ctx.lineWidth = 4;
  ctx.strokeRect(30, 30, width - 60, height - 60);
  
  // Başlık
  ctx.fillStyle = meta.colors.primary;
  ctx.font = `bold ${wallpaper.fontSizes.title}px Arial`;
  ctx.textAlign = 'center';
  ctx.fillText(meta.title, width / 2, 100);
  
  ctx.fillStyle = '#58a6ff';
  ctx.font = `${wallpaper.fontSizes.subtitle}px Arial`;
  ctx.fillText(meta.subtitle, width / 2, 150);
  
  // Sol sütun: MSC ve CPL
  const leftSections = sections.slice(0, 2); // MSC ve CPL
  const rightSections = sections.slice(2); // Klavye Kısayolları
  
  const colWidth = (width - 120) / 2;
  const leftX = 60;
  const rightX = leftX + colWidth;
  
  // Sol sütun çizimi
  let leftY = 200;
  leftSections.forEach((section) => {
    // Bölüm başlığı
    ctx.fillStyle = section.color;
    ctx.font = `bold ${wallpaper.fontSizes.section}px Arial`;
    ctx.textAlign = 'left';
    ctx.fillText(section.title, leftX, leftY);
    
    leftY += 50;
    
    // Maddeler
    ctx.fillStyle = meta.colors.text;
    ctx.font = `${wallpaper.fontSizes.item}px Arial`;
    
    section.items.forEach((item, itemIndex) => {
      // Nokta
      ctx.fillStyle = section.color;
      ctx.beginPath();
      ctx.arc(leftX, leftY - 6, 5, 0, Math.PI * 2);
      ctx.fill();
      
      // Metin
      ctx.fillStyle = meta.colors.text;
      ctx.fillText(item.command, leftX + 15, leftY);
      ctx.fillStyle = '#8b949e';
      ctx.fillText(`– ${item.description}`, leftX + 15, leftY + 22);
      
      leftY += 42;
    });
    
    leftY += 30; // Bölümler arası boşluk
  });
  
  // Sağ sütun çizimi
  let rightY = 200;
  rightSections.forEach((section) => {
    // Bölüm başlığı
    ctx.fillStyle = section.color;
    ctx.font = `bold ${wallpaper.fontSizes.section}px Arial`;
    ctx.textAlign = 'left';
    ctx.fillText(section.title, rightX, rightY);
    
    rightY += 50;
    
    // Maddeler
    ctx.fillStyle = meta.colors.text;
    ctx.font = `${wallpaper.fontSizes.item}px Arial`;
    
    section.items.forEach((item, itemIndex) => {
      // Nokta
      ctx.fillStyle = section.color;
      ctx.beginPath();
      ctx.arc(rightX, rightY - 6, 5, 0, Math.PI * 2);
      ctx.fill();
      
      // Metin
      ctx.fillStyle = meta.colors.text;
      ctx.fillText(item.command, rightX + 15, rightY);
      ctx.fillStyle = '#8b949e';
      ctx.fillText(`– ${item.description}`, rightX + 15, rightY + 22);
      
      rightY += 42;
    });
    
    rightY += 30; // Bölümler arası boşluk
  });
  
  // Alt bilgi
  ctx.fillStyle = '#8b949e';
  ctx.font = `${wallpaper.fontSizes.footer}px Arial`;
  ctx.textAlign = 'center';
  ctx.fillText(meta.footer, width / 2, height - 40);
  
  // Kaydet
  const outputDir = argv.output;
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const buffer = canvas.toBuffer('image/png');
  const outputPath = path.join(outputDir, 'windows-shortcuts-wallpaper.png');
  fs.writeFileSync(outputPath, buffer);
  
  console.log(`✅ Masaüstü resmi oluşturuldu: ${outputPath}`);
  return outputPath;
}

// PDF oluştur
async function createPDF(data) {
  console.log('📄 PDF dokümanı oluşturuluyor...');
  
  const { pdf } = data.layouts;
  const { meta, sections } = data;
  
  const doc = new PDFDocument({
    size: pdf.pageSize,
    margins: pdf.margins,
    bufferPages: true,
    info: {
      Title: meta.title,
      Author: 'Windows Kullanım Kılavuzu',
      Subject: meta.subtitle,
      Keywords: 'windows, shortcuts, msc, cpl, klavye'
    }
  });
  
  // Türkçe karakter desteği için font kaydet
  try {
    const fontPath = path.join(process.env.SystemRoot || 'C:\\Windows', 'Fonts', 'arial.ttf');
    const fontBoldPath = path.join(process.env.SystemRoot || 'C:\\Windows', 'Fonts', 'arialbd.ttf');
    
    if (fs.existsSync(fontPath)) {
      doc.registerFont('Arial', fontPath);
    }
    if (fs.existsSync(fontBoldPath)) {
      doc.registerFont('Arial-Bold', fontBoldPath);
    }
  } catch (e) {
    console.log('⚠️  Arial font yüklenemedi, varsayılan font kullanılacak');
  }
  
  const outputDir = argv.output;
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const outputPath = path.join(outputDir, 'windows-shortcuts-guide.pdf');
  const stream = fs.createWriteStream(outputPath);
  doc.pipe(stream);
  
  // Başlık
  const useArialFont = fs.existsSync(path.join(process.env.SystemRoot || 'C:\\Windows', 'Fonts', 'arial.ttf'));
  
  doc.fontSize(pdf.fontSizes.title)
     .fillColor(meta.colors.primary)
     .font(useArialFont ? 'Arial-Bold' : 'Helvetica-Bold')
     .text(meta.title, { align: 'center' });
  
  doc.moveDown(0.3);
  
  doc.fontSize(pdf.fontSizes.subtitle)
     .fillColor('#666')
     .font(useArialFont ? 'Arial' : 'Helvetica')
     .text(meta.subtitle, { align: 'center' });
  
  doc.moveDown(0.8);
  
  // Her bölüm için
  sections.forEach(section => {
    // Bölüm başlığı - tam sayfa genişliğinde ortalanmış
    const pageWidth = doc.page.width;
    const margins = doc.page.margins;
    
    doc.fontSize(pdf.fontSizes.section)
       .fillColor(section.color)
       .font(useArialFont ? 'Arial-Bold' : 'Helvetica-Bold')
       .text(
         `${section.icon} ${section.title.split(' ').slice(1).join(' ')}`,
         margins.left,
         doc.y,
         {
           width: pageWidth - margins.left - margins.right,
           align: 'center'
         }
       );
    
    doc.moveDown(0.5);
    
    // Maddeler
    doc.fontSize(pdf.fontSizes.item)
       .fillColor('#333')
       .font(useArialFont ? 'Arial' : 'Helvetica');
    
    const itemsPerColumn = Math.ceil(section.items.length / 2);
    const col1 = section.items.slice(0, itemsPerColumn);
    const col2 = section.items.slice(itemsPerColumn);
    
    const maxItems = Math.max(col1.length, col2.length);
    const leftX = doc.page.margins.left; // Sol margin
    const rightX = 300; // Sağ sütun başlangıcı
    
    for (let i = 0; i < maxItems; i++) {
      let currentY = doc.y;
      
      // Sayfa kontrolü - eğer yeterli alan yoksa yeni sayfa ve başlığı tekrar yaz
      if (currentY > 700) {
        doc.addPage();
        // Yeni sayfada başlığı tam sayfa genişliğinde ortalanmış olarak yaz
        const pageWidth = doc.page.width;
        const margins = doc.page.margins;
        
        doc.fontSize(pdf.fontSizes.section)
           .fillColor(section.color)
           .font(useArialFont ? 'Arial-Bold' : 'Helvetica-Bold')
           .text(
             `${section.icon} ${section.title.split(' ').slice(1).join(' ')}`,
             margins.left,
             doc.y,
             {
               width: pageWidth - margins.left - margins.right,
               align: 'center'
             }
           );
        doc.moveDown(0.5);
        doc.fontSize(pdf.fontSizes.item)
           .fillColor('#333')
           .font(useArialFont ? 'Arial' : 'Helvetica');
        currentY = doc.y; // Yeni Y pozisyonunu güncelle
      }
      
      let maxHeight = 0;
      
      // Sol sütun
      if (col1[i]) {
        const leftText = `• ${col1[i].command} – ${col1[i].description}`;
        const startY = currentY;
        doc.fillColor('#333')
           .font(useArialFont ? 'Arial' : 'Helvetica')
           .text(leftText, leftX, currentY, { 
             width: 220,
             lineGap: 3,
             align: 'left'
           });
        maxHeight = Math.max(maxHeight, doc.y - startY);
      }
      
      // Sağ sütun - Y pozisyonunu sabit tut
      if (col2[i]) {
        const rightText = `• ${col2[i].command} – ${col2[i].description}`;
        const startY = currentY;
        doc.y = currentY; // Y'yi tekrar başlangıç pozisyonuna getir
        doc.fillColor('#333')
           .font(useArialFont ? 'Arial' : 'Helvetica')
           .text(rightText, rightX, currentY, { 
             width: 220,
             lineGap: 3,
             align: 'left'
           });
        maxHeight = Math.max(maxHeight, doc.y - startY);
      }
      
      // Sonraki satıra geç - en uzun satırın yüksekliğini kullan
      doc.y = currentY + maxHeight + 5; // 5px ekstra boşluk
    }
    
    doc.moveDown(1);
  });
  
  // Alt bilgi ve İstatistikler - sadece sayfa sonunda yeterli alan varsa ekle
  const currentY = doc.y;
  const pageHeight = doc.page.height - doc.page.margins.bottom;
  const totalItems = sections.reduce((sum, section) => sum + section.items.length, 0);
  const statsHeight = 150; // İstatistikler için gereken yaklaşık alan
  
  // Eğer mevcut sayfada yeterli alan varsa alt bilgiyi ekle
  if (currentY + statsHeight < pageHeight) {
    doc.moveDown(2);
    doc.fontSize(pdf.fontSizes.footer)
       .fillColor('#666')
       .font(useArialFont ? 'Arial' : 'Helvetica')
       .text(meta.footer, { align: 'center' });
    
    doc.moveDown(1);
    
    // İstatistikler - underline kaldırıldı
    doc.fontSize(11)
       .fillColor('#333')
       .font(useArialFont ? 'Arial-Bold' : 'Helvetica-Bold')
       .text('📊 İstatistikler:');
    
    doc.moveDown(0.5);
    
    doc.fontSize(10)
       .font(useArialFont ? 'Arial' : 'Helvetica');
    sections.forEach(section => {
      doc.text(`  ${section.icon} ${section.title.split(' ').slice(1).join(' ')}: ${section.items.length} öğe`);
    });
    
    doc.moveDown(0.3);
    doc.text(`  📈 Toplam: ${totalItems} kısayol ve komut`);
  }
  
  // Sonlandır
  doc.end();
  
  return new Promise((resolve, reject) => {
    stream.on('finish', () => {
      console.log(`✅ PDF oluşturuldu: ${outputPath}`);
      resolve(outputPath);
    });
    
    stream.on('error', reject);
  });
}

// HTML oluştur
async function createHTML(data) {
  console.log('🌐 HTML sayfası oluşturuluyor...');
  
  const { meta, sections } = data;
  
  const html = `<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${meta.title}</title>
    <style>
        :root {
            --primary: ${meta.colors.primary};
            --secondary: ${meta.colors.secondary};
            --accent: ${meta.colors.accent};
            --bg: ${meta.colors.background};
            --text: ${meta.colors.text};
        }
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            background: linear-gradient(135deg, var(--bg) 0%, #1a1f2e 100%);
            color: var(--text);
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 40px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        
        header {
            text-align: center;
            margin-bottom: 50px;
            padding-bottom: 30px;
            border-bottom: 2px solid var(--primary);
        }
        
        h1 {
            font-size: 3em;
            background: linear-gradient(90deg, var(--primary), var(--accent));
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            margin-bottom: 10px;
        }
        
        .subtitle {
            font-size: 1.2em;
            color: #8b949e;
            margin-bottom: 20px;
        }
        
        .stats {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-top: 20px;
        }
        
        .stat-item {
            background: rgba(255, 255, 255, 0.1);
            padding: 10px 20px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 30px;
            margin-bottom: 50px;
        }
        
        .section {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 15px;
            padding: 25px;
            border-left: 5px solid;
            transition: all 0.3s ease;
        }
        
        .section:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
            background: rgba(255, 255, 255, 0.08);
        }
        
        .section-header {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-bottom: 25px;
            font-size: 1.4em;
        }
        
        .section-icon {
            font-size: 1.8em;
        }
        
        .item-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        
        .item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 10px;
            transition: all 0.2s ease;
        }
        
        .item:hover {
            background: rgba(255, 255, 255, 0.1);
            transform: translateX(5px);
        }
        
        .command {
            font-family: 'Consolas', 'Monaco', monospace;
            font-weight: bold;
            color: var(--primary);
            font-size: 0.95em;
        }
        
        .description {
            color: #c9d1d9;
            text-align: right;
            max-width: 60%;
        }
        
        .actions {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-top: 40px;
            padding-top: 30px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .btn {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            background: var(--primary);
            color: white;
            border: none;
            padding: 15px 30px;
            font-size: 1em;
            border-radius: 50px;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            font-weight: bold;
        }
        
        .btn:hover {
            background: var(--accent);
            transform: scale(1.05);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
        }
        
        .btn-download {
            background: var(--accent);
        }
        
        footer {
            text-align: center;
            margin-top: 50px;
            color: #8b949e;
            font-size: 0.9em;
        }
        
        .search-box {
            max-width: 500px;
            margin: 30px auto;
        }
        
        .search-input {
            width: 100%;
            padding: 15px 20px;
            background: rgba(255, 255, 255, 0.1);
            border: 2px solid rgba(255, 255, 255, 0.2);
            border-radius: 50px;
            color: white;
            font-size: 1em;
            outline: none;
            transition: all 0.3s ease;
        }
        
        .search-input:focus {
            border-color: var(--primary);
            box-shadow: 0 0 0 3px rgba(45, 125, 245, 0.3);
        }
        
        @media (max-width: 768px) {
            .grid {
                grid-template-columns: 1fr;
            }
            
            .item {
                flex-direction: column;
                gap: 10px;
                text-align: center;
            }
            
            .description {
                max-width: 100%;
                text-align: center;
            }
            
            .actions {
                flex-direction: column;
                align-items: center;
            }
            
            h1 {
                font-size: 2em;
            }
        }
        
        .highlight {
            background: rgba(var(--primary-rgb), 0.2);
            padding: 2px 5px;
            border-radius: 3px;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>${meta.title}</h1>
            <p class="subtitle">${meta.subtitle}</p>
            
            <div class="search-box">
                <input type="text" class="search-input" placeholder="🔍 Kısayol veya komut ara..." id="searchInput">
            </div>
            
            <div class="stats">
                ${sections.map(section => `
                    <div class="stat-item" style="border-left: 3px solid ${section.color}">
                        <span class="section-icon">${section.icon}</span>
                        <span>${section.items.length}</span>
                    </div>
                `).join('')}
            </div>
        </header>
        
        <div class="grid">
            ${sections.map(section => `
                <div class="section" style="border-left-color: ${section.color}">
                    <div class="section-header">
                        <span class="section-icon">${section.icon}</span>
                        <h3>${section.title}</h3>
                    </div>
                    
                    <div class="item-list">
                        ${section.items.map(item => `
                            <div class="item" data-search="${item.command.toLowerCase()} ${item.description.toLowerCase()}">
                                <span class="command">${item.command}</span>
                                <span class="description">${item.description}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('')}
        </div>
        
        <div class="actions">
            <button class="btn" onclick="window.print()">
                📄 PDF Olarak Kaydet
            </button>
            <a href="windows-shortcuts-wallpaper.png" download class="btn">
                🖼️ Masaüstü Resmi İndir
            </a>
            <a href="windows-shortcuts-guide.pdf" download class="btn btn-download">
                📥 Tam Rehberi İndir
            </a>
        </div>
        
        <footer>
            <p>${meta.footer}</p>
            <p style="margin-top: 10px;">Toplam ${sections.reduce((sum, s) => sum + s.items.length, 0)} kısayol ve komut</p>
        </footer>
    </div>
    
    <script>
        // Arama fonksiyonu
        document.getElementById('searchInput').addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const items = document.querySelectorAll('.item');
            
            items.forEach(item => {
                const searchText = item.dataset.search;
                if (searchText.includes(searchTerm)) {
                    item.style.display = 'flex';
                    
                    // Vurgulama
                    if (searchTerm) {
                        const command = item.querySelector('.command');
                        const description = item.querySelector('.description');
                        
                        command.innerHTML = command.textContent.replace(
                            new RegExp(searchTerm, 'gi'),
                            match => \`<span class="highlight">\${match}</span>\`
                        );
                        
                        description.innerHTML = description.textContent.replace(
                            new RegExp(searchTerm, 'gi'),
                            match => \`<span class="highlight">\${match}</span>\`
                        );
                    }
                } else {
                    item.style.display = 'none';
                }
            });
        });
        
        // Yazdırma için optimize
        window.addEventListener('beforeprint', () => {
            document.querySelectorAll('.btn, .search-box').forEach(el => el.style.display = 'none');
        });
        
        window.addEventListener('afterprint', () => {
            document.querySelectorAll('.btn, .search-box').forEach(el => el.style.display = '');
        });
        
        // Dosya kontrolü
        document.addEventListener('DOMContentLoaded', () => {
            const files = ['windows-shortcuts-wallpaper.png', 'windows-shortcuts-guide.pdf'];
            files.forEach(file => {
                fetch(file).then(res => {
                    if (!res.ok) {
                        const btn = document.querySelector(\`a[href="\${file}"]\`);
                        if (btn) {
                            btn.style.opacity = '0.5';
                            btn.title = 'Dosya henüz oluşturulmadı';
                        }
                    }
                });
            });
        });
        
        // Kopyalama fonksiyonu
        document.querySelectorAll('.command').forEach(el => {
            el.addEventListener('click', function() {
                const text = this.textContent;
                navigator.clipboard.writeText(text).then(() => {
                    const original = this.textContent;
                    this.textContent = '✓ Kopyalandı!';
                    setTimeout(() => this.textContent = original, 2000);
                });
            });
            el.style.cursor = 'pointer';
            el.title = 'Komutu kopyalamak için tıkla';
        });
    </script>
</body>
</html>`;
  
  const outputDir = argv.output;
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const outputPath = path.join(outputDir, 'index.html');
  fs.writeFileSync(outputPath, html);
  
  console.log(`✅ HTML oluşturuldu: ${outputPath}`);
  return outputPath;
}

// Ana fonksiyon
async function main() {
  console.log('🚀 Windows Kısayolları Üreticisi\n');
  
  const data = loadData();
  const { meta, sections } = data;
  
  console.log(`📊 Yüklenen veriler:`);
  console.log(`   • Başlık: ${meta.title}`);
  console.log(`   • Bölümler: ${sections.length}`);
  console.log(`   • Toplam öğe: ${sections.reduce((sum, s) => sum + s.items.length, 0)}\n`);
  
  const outputDir = argv.output;
  
  // Çıktı klasörünü oluştur
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  try {
    // İşlemleri yürüt
    if (argv.all || (!argv.wallpaper && !argv.pdf && !argv.html)) {
      await createWallpaper(data);
      await createPDF(data);
      await createHTML(data);
      
      console.log('\n🎉 Tüm çıktılar başarıyla oluşturuldu!');
      console.log(`📁 Çıktı klasörü: ${path.resolve(outputDir)}`);
      console.log('\n📂 Oluşturulan dosyalar:');
      console.log('   • index.html (Web arayüzü)');
      console.log('   • windows-shortcuts-wallpaper.png (Masaüstü resmi)');
      console.log('   • windows-shortcuts-guide.pdf (PDF rehber)');
      console.log(`\n👉 Tarayıcıda açmak için: file://${path.resolve(outputDir, 'index.html')}`);
      
    } else if (argv.wallpaper) {
      await createWallpaper(data);
    } else if (argv.pdf) {
      await createPDF(data);
    } else if (argv.html) {
      await createHTML(data);
    }
    
  } catch (error) {
    console.error('❌ Hata:', error.message);
    process.exit(1);
  }
}

// Watch modu
if (argv.watch) {
  console.log('👀 data.json dosyası izleniyor... (değişikliklerde otomatik yeniden oluştur)');
  
  const watcher = chokidar.watch('data.json', {
    persistent: true,
    ignoreInitial: true
  });
  
  watcher.on('change', async (path) => {
    console.log(`\n🔄 ${path} değiştirildi, yeniden oluşturuluyor...`);
    await main();
  });
  
  // İlk çalıştırma
  main();
  
} else {
  // Normal mod
  main();
}
