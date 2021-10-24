find src/ -iname '*.ts' | xargs organize-imports-cli
find src/ -iname '*.tsx' | xargs organize-imports-cli
prettier --write 'src/**/*.{css,html,js,ts,tsx}'