{# 🚀 Offnet

![Versión](https://img.shields.io/badge/versión-0.1.0-blue.svg)
![Licencia](https://img.shields.io/badge/licencia-MIT-green.svg)

## 🌟 Descripción

Offnet es una aplicación de escritorio dedicada a ser una alternativa de chat de voz, video y transmision de archivos, usando clientes sockets y conexiones P2P. 

## 🛠️ Tecnologías principales

- 🅰️ Angular 17
- 🦀 Rust (Tauri)
- 🎨 TailwindCSS
- 🌈 DaisyUI

## 🚀 Características

- 🖥️ Aplicación de escritorio multiplataforma
- 🎨 Interfaz de usuario moderna y responsive
- 🌐 Soporte para internacionalización (i18n)
- 🔒 Seguridad mejorada con Tauri

## 🏁 Inicio rápido

1. Clona el repositorio
2. Instala las dependencias (Arch):
   ```
    sudo pacman -Syu
   ```
   ```
   sudo pacman -S --needed \
       webkit2gtk-4.1 \
       base-devel \
       curl \
       wget \
       file \
       openssl \
       appmenu-gtk-module \
       gtk3 \
       libappindicator-gtk3 \
       librsvg \
       libvips
   ```
   ```  
   npm install
   ```
4. Inicia la aplicación en modo desarrollo:
   ```
   npm run tauri dev
   ```

## 📦 Build

Para hacer una build de la aplicación para producción:

```
npm run tauri build
```

## 🤝 Contribución

¡Las contribuciones estan cerradas!

## 🙏 Agradecimientos

- [Angular](https://angular.io/)
- [Tauri](https://tauri.app/)
- [TailwindCSS](https://tailwindcss.com/)
- [DaisyUI](https://daisyui.com/)

---

Hecho con ❤️ por Jaime Jimenez
