# 🚀 Offnet

![Versión](https://img.shields.io/badge/versión-0.1.0-blue.svg)
![Licencia](https://img.shields.io/badge/licencia-MIT-green.svg)

## 🌟 Descripción

Offnet es una aplicación de escritorio dedicada a ser una alternativa de chat de voz, video y transmision de archivos, usando clientes sockets y conexiones P2P. 

Ten en cuenta que esta aplicación esta en desarrollo y no esta lista para uso en producción. Tambien tienes que saber que posiblemente nunca estará lista para uso en producción ya que estoy construyendo esta aplicacion como una pureba de concepto.

Estado de la aplicación:
- [ ] Implementar el chat de voz y video (50%) Solo funciona en llamdas entre dos usuarios
- [ ] Implementar la transmision de archivos (0%) No emepzado
- [ ] Implementar la autenticación y registro de usuarios (50%)
- [ ] Implementat NAT punchthrough (0%) Revisando Documentación de STUN server
- [ ] Implementacion de WebRTC (50%) Refactor pendiente
- [ ] Implementacion de UI (X%) Refactor pendiente
- [ ] Backend needs refacor and a lot thinking about how to implement it well

## Tech Stack

- 🅰️ Angular 17
- 🦀 Rust (Tauri)
- 🎨 TailwindCSS
- 🌈 DaisyUI
- 📡 WebRTC
- 📡 Socket.io

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
