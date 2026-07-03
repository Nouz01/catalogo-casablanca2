# Puesta en marcha del catálogo digital Casablanca

El código ya está escrito. Faltan los pasos que sólo el dueño de la cuenta puede
hacer (crear cuentas gratuitas, copiar claves). Son 3 servicios, todos gratis
para este volumen de uso.

## 1. Supabase (base de datos + fotos + login)

1. Entrar a https://supabase.com y crear una cuenta gratis (con GitHub o email).
2. "New project" → elegir un nombre (ej. `casablanca-catalogo`) y una
   contraseña de base de datos (guardarla en un lugar seguro, no hace falta
   recordarla después).
3. Cuando el proyecto termine de crearse: ir a **SQL Editor** → **New query**,
   pegar todo el contenido de [`supabase/schema.sql`](supabase/schema.sql) de
   esta carpeta, y ejecutar (▶ Run). Esto crea las tablas, los permisos y los
   buckets de fotos.
4. Ir a **Authentication → Users → Add user** y crear el usuario admin (el
   que va a usar la vendedora para entrar al panel): un email y una
   contraseña. Con eso alcanza, no hace falta que confirme el email.
5. Ir a **Project Settings → API** y copiar:
   - **Project URL**
   - **anon public key**
6. En esta carpeta (`catalogo-web/`), copiar `.env.local.example` a
   `.env.local` y completar esos dos valores:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   ```

## 2. Probar en la computadora

```
npm run dev
```

Abrir http://localhost:3000 → debería verse el catálogo (vacío al principio).
Entrar a http://localhost:3000/login con el usuario creado en el paso 1.4,
crear una categoría y un producto de prueba, subirle una foto, y verificar
que aparece en la página pública.

## 3. GitHub + Vercel (para tener un link público)

1. Crear un repo nuevo (vacío) en https://github.com/new.
2. Desde esta carpeta:
   ```
   git init
   git add .
   git commit -m "Catálogo digital Casablanca"
   git remote add origin <URL del repo que creaste>
   git branch -M main
   git push -u origin main
   ```
3. Entrar a https://vercel.com, crear cuenta gratis (con GitHub), **Add New
   → Project**, elegir este repo.
4. En **Environment Variables** cargar las mismas dos variables del paso 1.6
   (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
5. Deploy. Vercel da un link público (`https://algo.vercel.app`) — ese es el
   link que se comparte por WhatsApp/Instagram. Cada vez que se suba un
   cambio a GitHub, Vercel actualiza el sitio solo.

Un dominio propio (ej. `catalogo.casablancahogar.com`) se puede sumar después
desde Vercel → Project Settings → Domains, sin tocar nada del código.

## Qué puede hacer la vendedora sola, sin tocar código

Desde `/admin` (con el usuario y contraseña del paso 1.4):
- Crear, renombrar y borrar categorías.
- Crear, editar y borrar productos (nombre, precio, detalles, beneficios,
  características).
- Subir, agregar y borrar fotos de cada producto — se ven en el sitio público
  al instante, sin esperar ningún deploy.
- Cambiar el nombre de marca, el logo y el número de WhatsApp de contacto
  desde **Ajustes**.
