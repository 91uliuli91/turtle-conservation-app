#!/bin/bash
# install-security.sh
# Script de instalación automática del sistema de seguridad

set -e  # Salir si hay algún error

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir con color
print_color() {
    color=$1
    message=$2
    echo -e "${color}${message}${NC}"
}

# Función para verificar comandos
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

print_color "$BLUE" "============================================"
print_color "$BLUE" "🔐 TurtleTrack - Instalación de Seguridad"
print_color "$BLUE" "============================================"
echo ""

# 1. Verificar Node.js
print_color "$YELLOW" "📦 Verificando Node.js..."
if ! command_exists node; then
    print_color "$RED" "❌ Node.js no está instalado"
    print_color "$YELLOW" "Por favor instala Node.js desde https://nodejs.org"
    exit 1
fi
NODE_VERSION=$(node -v)
print_color "$GREEN" "✅ Node.js instalado: $NODE_VERSION"
echo ""

# 2. Verificar npm
print_color "$YELLOW" "📦 Verificando npm..."
if ! command_exists npm; then
    print_color "$RED" "❌ npm no está instalado"
    exit 1
fi
NPM_VERSION=$(npm -v)
print_color "$GREEN" "✅ npm instalado: $NPM_VERSION"
echo ""

# 3. Instalar dependencias
print_color "$YELLOW" "📦 Instalando dependencias de seguridad..."
npm install jose bcryptjs
npm install --save-dev @types/bcryptjs

if [ $? -eq 0 ]; then
    print_color "$GREEN" "✅ Dependencias instaladas correctamente"
else
    print_color "$RED" "❌ Error instalando dependencias"
    exit 1
fi
echo ""

# 4. Verificar PostgreSQL
print_color "$YELLOW" "🗄️  Verificando PostgreSQL..."
if ! command_exists psql; then
    print_color "$RED" "❌ PostgreSQL no está instalado o no está en PATH"
    print_color "$YELLOW" "Por favor instala PostgreSQL desde https://www.postgresql.org"
    exit 1
fi
PSQL_VERSION=$(psql --version)
print_color "$GREEN" "✅ PostgreSQL instalado: $PSQL_VERSION"
echo ""

# 5. Generar JWT_SECRET
print_color "$YELLOW" "🔑 Generando JWT_SECRET..."
if command_exists openssl; then
    JWT_SECRET=$(openssl rand -base64 32)
    print_color "$GREEN" "✅ JWT_SECRET generado"
else
    print_color "$YELLOW" "⚠️  openssl no disponible, usando alternativa"
    JWT_SECRET=$(head /dev/urandom | tr -dc A-Za-z0-9 | head -c 32)
fi
echo ""

# 6. Crear/actualizar .env.local
print_color "$YELLOW" "📝 Configurando .env.local..."
if [ -f ".env.local" ]; then
    print_color "$YELLOW" "⚠️  .env.local ya existe. ¿Deseas hacer backup? (s/n)"
    read -r response
    if [[ "$response" =~ ^([sS])$ ]]; then
        cp .env.local .env.local.backup.$(date +%Y%m%d_%H%M%S)
        print_color "$GREEN" "✅ Backup creado"
    fi
fi

# Verificar si JWT_SECRET ya existe en .env.local
if grep -q "JWT_SECRET=" .env.local 2>/dev/null; then
    print_color "$YELLOW" "⚠️  JWT_SECRET ya existe. ¿Deseas reemplazarlo? (s/n)"
    read -r response
    if [[ "$response" =~ ^([sS])$ ]]; then
        sed -i.bak "s|JWT_SECRET=.*|JWT_SECRET=$JWT_SECRET|" .env.local
        print_color "$GREEN" "✅ JWT_SECRET actualizado"
    else
        print_color "$BLUE" "ℹ️  Manteniendo JWT_SECRET existente"
    fi
else
    # Agregar JWT_SECRET al .env.local
    echo "" >> .env.local
    echo "# 🔐 Seguridad - Generado automáticamente" >> .env.local
    echo "JWT_SECRET=$JWT_SECRET" >> .env.local
    print_color "$GREEN" "✅ JWT_SECRET agregado a .env.local"
fi
echo ""

# 7. Ejecutar SQL para crear tablas
print_color "$YELLOW" "🗄️  ¿Deseas ejecutar el script SQL para crear las tablas de seguridad? (s/n)"
read -r response
if [[ "$response" =~ ^([sS])$ ]]; then
    print_color "$YELLOW" "Ingresa el nombre de usuario de PostgreSQL (default: misterturtle):"
    read -r DB_USER
    DB_USER=${DB_USER:-misterturtle}
    
    print_color "$YELLOW" "Ingresa el nombre de la base de datos (default: coral_de_datos):"
    read -r DB_NAME
    DB_NAME=${DB_NAME:-coral_de_datos}
    
    if [ -f "security_tables.sql" ]; then
        PGPASSWORD="" psql -U "$DB_USER" -d "$DB_NAME" -f security_tables.sql
        if [ $? -eq 0 ]; then
            print_color "$GREEN" "✅ Tablas de seguridad creadas"
        else
            print_color "$RED" "❌ Error ejecutando SQL"
            print_color "$YELLOW" "Puedes ejecutar manualmente: psql -U $DB_USER -d $DB_NAME -f security_tables.sql"
        fi
    else
        print_color "$RED" "❌ Archivo security_tables.sql no encontrado"
    fi
else
    print_color "$BLUE" "ℹ️  Omitiendo creación de tablas"
    print_color "$YELLOW" "Recuerda ejecutar manualmente: psql -U tu_usuario -d tu_db -f security_tables.sql"
fi
echo ""

# 8. Verificar archivos creados
print_color "$YELLOW" "📁 Verificando archivos del sistema de seguridad..."

FILES=(
    "src/middleware.ts"
    "src/lib/auth-utils.ts"
    "src/components/SecureAuthForm.tsx"
    "src/app/api/auth/login/route.ts"
    "src/app/api/auth/registro/route.ts"
)

all_files_exist=true
for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        print_color "$GREEN" "  ✅ $file"
    else
        print_color "$RED" "  ❌ $file (falta)"
        all_files_exist=false
    fi
done
echo ""

# 9. Resumen final
print_color "$BLUE" "============================================"
print_color "$BLUE" "📋 RESUMEN DE INSTALACIÓN"
print_color "$BLUE" "============================================"
echo ""

if $all_files_exist; then
    print_color "$GREEN" "✅ Todos los archivos están presentes"
else
    print_color "$YELLOW" "⚠️  Algunos archivos faltan. Revisa la documentación."
fi
echo ""

print_color "$GREEN" "✅ Instalación completada"
echo ""
print_color "$BLUE" "📚 PRÓXIMOS PASOS:"
echo ""
print_color "$YELLOW" "1. Revisar y editar .env.local con tus configuraciones"
print_color "$YELLOW" "2. Si no ejecutaste el SQL, hacerlo manualmente:"
echo "   psql -U misterturtle -d coral_de_datos -f security_tables.sql"
print_color "$YELLOW" "3. Iniciar el servidor de desarrollo:"
echo "   npm run dev"
print_color "$YELLOW" "4. Probar el sistema de autenticación en:"
echo "   http://localhost:3000"
print_color "$YELLOW" "5. Revisar la documentación completa en:"
echo "   SECURITY_SETUP.md"
echo ""

print_color "$BLUE" "🔒 IMPORTANTE:"
print_color "$RED" "   - NUNCA subas .env.local a Git"
print_color "$RED" "   - Cambia JWT_SECRET en producción"
print_color "$RED" "   - Habilita HTTPS en producción"
echo ""

print_color "$GREEN" "🎉 ¡Instalación exitosa!"
print_color "$BLUE" "============================================"
echo ""

# 10. Generar reporte de instalación
REPORT_FILE="installation_report_$(date +%Y%m%d_%H%M%S).txt"
{
    echo "TurtleTrack Security Installation Report"
    echo "========================================"
    echo "Date: $(date)"
    echo "Node Version: $NODE_VERSION"
    echo "npm Version: $NPM_VERSION"
    echo "PostgreSQL Version: $PSQL_VERSION"
    echo ""
    echo "JWT_SECRET: $JWT_SECRET"
    echo ""
    echo "Files Status:"
    for file in "${FILES[@]}"; do
        if [ -f "$file" ]; then
            echo "  ✅ $file"
        else
            echo "  ❌ $file"
        fi
    done
} > "$REPORT_FILE"

print_color "$BLUE" "📄 Reporte de instalación guardado en: $REPORT_FILE"
echo ""