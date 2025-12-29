# 🪟 Windows Kısayolları Üreticisi

Windows komutları, kısayolları ve sistem araçlarını modern ve görsel formatlar halinde sunan otomatik içerik üreticisi.

![Windows](https://img.shields.io/badge/Windows-0078D6?style=for-the-badge&logo=windows&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)

## 📋 İçindekiler

- [Özellikler](#-özellikler)
- [Kurulum](#-kurulum)
- [Kullanım](#-kullanım)
- [Komut Satırı Seçenekleri](#️-komut-satırı-seçenekleri)
- [Çıktı Formatları](#-çıktı-formatları)
- [Özelleştirme](#-özelleştirme)
- [Yapı](#-yapı)
- [Katkıda Bulunma](#-katkıda-bulunma)
- [Lisans](#-lisans)

## ✨ Özellikler

### 🎨 Çoklu Format Desteği
- **PDF Rehberi**: Yazdırılabilir, profesyonel PDF dokümanı
- **HTML Arayüzü**: İnteraktif, aranabilir web sayfası
- **Masaüstü Resmi**: 1920x1080 duvar kağıdı

### 🌍 Türkçe Karakter Desteği
- Arial font kullanımı ile tam Türkçe karakter desteği
- Ğ, Ü, Ş, İ, Ö, Ç karakterlerinde sorun yok

### 📱 Responsive Tasarım
- Mobil uyumlu HTML çıktısı
- Optimize edilmiş PDF düzeni
- Yüksek çözünürlüklü masaüstü resmi

### 🔍 Arama ve Filtreleme
- HTML arayüzünde canlı arama
- Komut ve açıklamalarda vurgulama
- Kopyalama özellikleri

### ⚡ Performans
- Hızlı içerik üretimi
- Watch mode ile otomatik yenileme
- Optimize edilmiş dosya boyutları

## 🚀 Kurulum

### Gereksinimler
- Node.js 14 veya üzeri
- npm veya yarn paket yöneticisi
- Windows işletim sistemi (font desteği için)

### Adımlar

1. **Projeyi klonlayın**
```bash
git clone https://github.com/eaeoz/windows-shortcuts.git
cd windows-shortcuts
```

2. **Bağımlılıkları yükleyin**
```bash
npm install
```

3. **Çalıştırın**
```bash
npm start
```

## 💻 Kullanım

### Temel Kullanım

Tüm çıktıları oluşturmak için:
```bash
node script.js
```

veya

```bash
npm start
```

### Belirli Çıktı Oluşturma

**Sadece PDF:**
```bash
node script.js --pdf
# veya
npm run pdf
```

**Sadece HTML:**
```bash
node script.js --html
# veya
npm run html
```

**Sadece Masaüstü Resmi:**
```bash
node script.js --wallpaper
# veya
npm run wallpaper
```

### Watch Modu

`data.json` dosyasındaki değişiklikleri otomatik izlemek için:
```bash
node script.js --watch
# veya
npm run watch
```

Bu modda çalışırken, `data.json` dosyasında yaptığınız her değişiklik otomatik olarak tüm çıktıları yeniden oluşturur.

## 🛠️ Komut Satırı Seçenekleri

| Seçenek | Kısa | Açıklama |
|---------|------|----------|
| `--all` | `-a` | Tüm çıktıları oluştur |
| `--pdf` | `-p` | Sadece PDF oluştur |
| `--html` | `-h` | Sadece HTML oluştur |
| `--wallpaper` | `-w` | Sadece masaüstü resmi oluştur |
| `--watch` | `-W` | data.json değişikliklerini izle |
| `--output` | `-o` | Çıktı klasörünü belirle (varsayılan: ./output) |
| `--help` | | Yardım mesajını göster |

### Örnekler

```bash
# Özel çıktı klasörü ile PDF oluştur
node script.js --pdf --output ./my-output

# Tüm çıktıları belirli klasöre oluştur
node script.js --all -o ./dist

# Watch modunda çalıştır
node script.js -W
```

## 📦 Çıktı Formatları

### 📄 PDF Rehberi
**Dosya:** `output/windows-shortcuts-guide.pdf`

**Özellikler:**
- A4 boyutunda profesyonel düzen
- Optimize edilmiş kenar boşlukları (üst/alt: 15px)
- İki sütunlu görünüm
- Türkçe karakter desteği
- Ortalanmış bölüm başlıkları
- Dinamik satır yüksekliği (üst üste binme yok)
- İstatistik bölümü

**Kullanım:**
- Yazdırma için ideal
- Offline referans
- Dokümantasyon

### 🌐 HTML Arayüzü
**Dosya:** `output/index.html`

**Özellikler:**
- Modern, responsive tasarım
- Canlı arama fonksiyonu
- Komut kopyalama (tıklama ile)
- Karanlık tema
- Gradient efektleri
- Hover animasyonları
- Yazdırma optimize edilmiş

**Kullanım:**
- Tarayıcıda açın
- Komutları arayın
- Tıklayarak kopyalayın
- Yazdırın veya PDF olarak kaydedin

### 🖼️ Masaüstü Resmi
**Dosya:** `output/windows-shortcuts-wallpaper.png`

**Özellikler:**
- 1920x1080 çözünürlük
- Üç sütunlu düzen
- Koyu tema
- Gradient arka plan
- Renkli bölüm başlıkları

**Kullanım:**
- Masaüstü duvar kağıdı olarak ayarlayın
- Hızlı referans için
- Ekran paylaşımlarında

## 🎨 Özelleştirme

### data.json Düzenleme

Tüm içerik `data.json` dosyasında tanımlıdır. Bu dosyayı düzenleyerek:

**Meta bilgileri değiştirin:**
```json
{
  "meta": {
    "title": "Windows Kullanım Rehberi",
    "subtitle": "MSC Komutları • CPL Araçları • Klavye Kısayolları",
    "footer": "windows-kisayollari.com | Güncelleme: 2024",
    "colors": {
      "primary": "#2d7df5",
      "secondary": "#ff6b00",
      "accent": "#10b981",
      "background": "#0d1117",
      "text": "#c9d1d9"
    }
  }
}
```

**Yeni bölüm ekleyin:**
```json
{
  "sections": [
    {
      "id": "yeni-bolum",
      "title": "🔧 YENİ BÖLÜM",
      "icon": "🔧",
      "color": "#ff0000",
      "items": [
        {
          "command": "örnek.komut",
          "description": "Komut açıklaması"
        }
      ]
    }
  ]
}
```

**Düzen ayarlarını değiştirin:**
```json
{
  "layouts": {
    "pdf": {
      "pageSize": "A4",
      "margins": {
        "top": 15,
        "bottom": 15,
        "left": 30,
        "right": 30
      },
      "fontSizes": {
        "title": 22,
        "subtitle": 12,
        "section": 14,
        "item": 10,
        "footer": 9
      }
    }
  }
}
```

### Renk Temaları

**Mavi Tema (Varsayılan):**
```json
"colors": {
  "primary": "#2d7df5",
  "secondary": "#ff6b00",
  "accent": "#10b981"
}
```

**Mor Tema:**
```json
"colors": {
  "primary": "#8b5cf6",
  "secondary": "#ec4899",
  "accent": "#06b6d4"
}
```

**Kırmızı Tema:**
```json
"colors": {
  "primary": "#ef4444",
  "secondary": "#f59e0b",
  "accent": "#10b981"
}
```

## 📁 Yapı

```
windows-shortcuts/
├── 📄 script.js          # Ana uygulama
├── 📋 data.json          # İçerik verisi
├── 📦 package.json       # Proje bağımlılıkları
├── 📖 README.md          # Bu dosya
├── 🚫 .gitignore         # Git ignore kuralları
└── 📁 output/            # Üretilen dosyalar
    ├── windows-shortcuts-guide.pdf
    ├── windows-shortcuts-wallpaper.png
    └── index.html
```

### Bağımlılıklar

```json
{
  "@napi-rs/canvas": "Canvas görüntü oluşturma",
  "pdfkit": "PDF doküman oluşturma",
  "yargs": "Komut satırı argüman yönetimi",
  "chokidar": "Dosya izleme (watch mode)"
}
```

## 🎯 İçerik Kategorileri

### 🖥️ MSC Komutları
Windows yönetim konsolları (Microsoft Management Console):
- Olay Görüntüleyici (eventvwr.msc)
- Görev Zamanlayıcı (taskschd.msc)
- Hizmetler (services.msc)
- Aygıt Yöneticisi (devmgmt.msc)
- ve daha fazlası...

### ⚙️ CPL Araçları
Denetim Masası uygulamaları (Control Panel Items):
- Program Ekle/Kaldır (appwiz.cpl)
- Ağ Bağlantıları (ncpa.cpl)
- Sistem Özellikleri (sysdm.cpl)
- İnternet Özellikleri (inetcpl.cpl)
- ve daha fazlası...

### ⌨️ Klavye Kısayolları
Windows klavye kombinasyonları:
- Win + R: Çalıştır penceresi
- Win + E: Dosya Gezgini
- Ctrl + Shift + Esc: Görev Yöneticisi
- Win + Shift + S: Ekran alıntısı
- ve daha fazlası...

## 🔧 Sorun Giderme

### Font Sorunları
**Problem:** Türkçe karakterler düzgün görünmüyor

**Çözüm:** 
- Arial fontunun sisteminizde yüklü olduğundan emin olun
- Windows Fonts klasörünü kontrol edin: `C:\Windows\Fonts\`
- Gerekirse script'i yönetici olarak çalıştırın

### PDF Boş Çıkıyor
**Problem:** PDF dosyası boş veya eksik içerik var

**Çözüm:**
- `data.json` dosyasının geçerli JSON formatında olduğundan emin olun
- Konsol çıktısındaki hata mesajlarını kontrol edin
- Node.js versiyonunu güncelleyin (14+)

### HTML Arama Çalışmıyor
**Problem:** Arama fonksiyonu sonuç vermiyor

**Çözüm:**
- Tarayıcı konsolunu kontrol edin (F12)
- JavaScript'in etkin olduğundan emin olun
- Dosyayı `file://` protokolü ile açın

## 📊 Performans

- **PDF Oluşturma:** ~500ms
- **HTML Oluşturma:** ~100ms
- **PNG Oluşturma:** ~800ms
- **Toplam:** ~1.5 saniye

*Test ortamı: Node.js 18, Windows 11, i5-8250U*

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! Şu şekillerde katkıda bulunabilirsiniz:

1. **Yeni Komutlar:** `data.json` dosyasına yeni komutlar ekleyin
2. **Hata Düzeltmeleri:** Bug'ları bildirin veya düzeltin
3. **Yeni Özellikler:** Yeni formatlar veya özellikler önerin
4. **Dokümantasyon:** README'yi iyileştirin

### Katkı Adımları

1. Projeyi fork edin
2. Feature branch oluşturun (`git checkout -b feature/yeni-ozellik`)
3. Değişikliklerinizi commit edin (`git commit -am 'Yeni özellik eklendi'`)
4. Branch'inizi push edin (`git push origin feature/yeni-ozellik`)
5. Pull Request oluşturun

## 📝 Değişiklik Geçmişi

### v1.2.0 (2024-12-29)
- ✅ Türkçe karakter desteği eklendi
- ✅ PDF kenar boşlukları optimize edildi
- ✅ Bölüm başlıkları ortalandı
- ✅ Dinamik satır yüksekliği eklendi
- ✅ Metinlerin üst üste binme sorunu giderildi

### v1.1.0
- ✅ HTML arama fonksiyonu eklendi
- ✅ Kopyalama özelliği eklendi
- ✅ Responsive tasarım iyileştirildi

### v1.0.0
- 🎉 İlk sürüm yayınlandı

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 👨‍💻 Geliştirici

**Sedat Emir Acar**
- GitHub: [@eaeoz](https://github.com/eaeoz)
- Repository: [windows-shortcuts](https://github.com/eaeoz/windows-shortcuts)

## 🙏 Teşekkürler

Bu projeyi kullandığınız için teşekkürler! Geri bildirimlerinizi bekliyoruz.

---

⭐ Projeyi beğendiyseniz yıldız vermeyi unutmayın!

📧 Sorularınız için issue açabilirsiniz.

🔄 Güncellemeler için repository'yi watch edin.
