# Notiq

A cross-platform Markdown editor and previewer built with React and Electron, with a focus on a clean user interface and seamless integration with your file system.

## About

[Your App Name Here] is a modern, cross-platform application designed to provide a beautiful and efficient Markdown editing and previewing experience. Built with a focus on performance and user experience, it aims to be a reliable tool for writers, developers, and anyone who works with Markdown files.
Notiq is a modern, cross-platform application designed to provide a beautiful and efficient Markdown editing and previewing experience. Built with a focus on performance and user experience, it aims to be a reliable tool for writers, developers, and anyone who works with Markdown files.

## Features

- **Cross-Platform:** Available on Windows, macOS, and Linux, thanks to Electron.
- **Beautiful Themed Preview:** Enjoy your Markdown with stunning, customizable themes.
- **Real-time Editing:** See your changes reflected instantly in the preview.
- **Native File Integration:** Open, edit, and save Markdown files directly from your file system.
- **Extensible Markdown Pipeline:** Powered by the unified ecosystem for robust parsing and rendering.
- **Syntax Highlighting:** Code blocks in your Markdown are beautifully highlighted.
- **Secure Preview:** Sanitized HTML rendering ensures a safe viewing experience.
- **Theming Engine:** Customize or create your own themes with a flexible CSS variable system.

## Why I Built This

Hi, I'm Kwizera Mugisha Olivier, the developer behind Notiq.

I built this application because I saw a need for a Markdown editor that was both powerful and aesthetically pleasing, with a focus on a seamless cross-platform desktop experience. While there are many web-based or platform-specific Markdown tools available, I wanted to create something that felt truly native on any operating system, offering deep integration with the file system and a delightful user interface.

My goal is to provide a tool that makes writing and previewing Markdown a joy, allowing users to focus on their content without being hindered by clunky interfaces or limited functionality. This project is an ongoing effort to build a robust, user-friendly, and beautiful Markdown editor for everyone.

## Technologies Used

- **Frontend:** React, TypeScript, Vite
- **Editor:** CodeMirror 6
- **Markdown Parsing:** unified, remark, rehype
- **Styling:** CSS Modules (or mention your chosen styling method if different)
- **Desktop Packaging:** Electron

## Project Structure

- `.idx`: Contains files related to the development environment setup using Nix.
- `src/electron`: Houses the Electron main and preload scripts.
- `src/ui`: Contains the React application for the user interface.
  - `src/ui/src`: The main source code for the React application.
  - `src/ui/public`: Static assets.
  - `src/ui/dist`: Build output for the React application.

## Getting Started

To get started with the application, follow these steps:

1.  **Clone the repository:** Open your terminal and run:
