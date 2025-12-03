# Debugging și Troubleshooting

## Problema: Vocabularul nu se încarcă

**Soluție:** Verifică în Console (F12 în browser) dacă există erori la încărcarea `/vocab.ro.json`.

## Problema: Drag & drop nu funcționează

**Soluție:** Verifică dacă elementele au `draggable="true"` și event listeners corecți.

## Problema: Vocea nu funcționează

**Soluție:** Unele browsere (Safari) necesită interacțiune utilizator înainte de a activa sinteza vocală.

## Problema: Modificările nu apar

**Soluție:**

1. Verifică că `bun run dev` rulează
2. Reîmprospătează pagina (Ctrl+R sau Cmd+R)
3. Dacă persistă, șterge cache-ul browserului (Ctrl+Shift+R)
