#!/usr/bin/env bash
# Inicia "La Noche de los Triángulos Congruentes": servidor Node (server.js) con el juego, la sala de espera y el dashboard del profesor.
# Los alumnos solo pueden jugar si el profesor los acepta en el dashboard. Requiere Node.js (https://nodejs.org).
# macOS: doble clic. Linux: ./iniciar.command
# Opciones: PORT=5050 ./iniciar.command   ·   NO_OPEN=1 para no abrir el navegador
#           ./iniciar.command --pruebas   habilita el atajo ?n=3 (saltar de noche) SOLO para quien prueba el juego
#
# Cada vez que se enciende se crea una SESIÓN NUEVA (public/session.json) y se borra al apagarse.
# Al abrir el juego, cada navegador compara su sesión guardada con la actual: si es distinta, borra
# nombre, avance y estrellas. Así, quien entre en la siguiente sesión empieza siempre desde la Noche 1.

cd "$(dirname "$0")" || exit 1

# Al hacer doble clic, Terminal no siempre trae el PATH de Homebrew / nvm
export PATH="$PATH:/opt/homebrew/bin:/usr/local/bin:$HOME/.npm-global/bin"
[ -s "$HOME/.nvm/nvm.sh" ] && . "$HOME/.nvm/nvm.sh" >/dev/null 2>&1

SESSION_FILE="public/session.json"
PRUEBAS=false
for arg in "$@"; do [ "$arg" = "--pruebas" ] && PRUEBAS=true; done
PORT="${PORT:-5000}"

pausa() { echo; read -r -p "Presiona Enter para cerrar…" _; }
SESSION_ID=""
limpiar() {
  # solo se borra la sesión si sigue siendo la de ESTE encendido (por si ya se encendió otro servidor)
  [ -n "$SESSION_ID" ] && grep -q "\"$SESSION_ID\"" "$SESSION_FILE" 2>/dev/null && rm -f "$SESSION_FILE"
  [ -n "$OPENER_PID" ] && kill "$OPENER_PID" 2>/dev/null
}
trap limpiar EXIT
trap 'exit 0' INT TERM HUP

# Si ya hay otro servidor de ESTA carpeta encendido, no se pisa su sesión (borraría el avance de quienes juegan)
if [ -f "$SESSION_FILE" ]; then
  OLD_ID="$(sed -n 's/.*"id":"\([^"]*\)".*/\1/p' "$SESSION_FILE")"
  for p in 5000 5050 5051 5052 5053 5054 5055; do
    if [ -n "$OLD_ID" ] && curl -s --max-time 1 "http://127.0.0.1:$p/session.json" 2>/dev/null | grep -q "\"$OLD_ID\""; then
      echo "⚠  Ya hay un servidor activo (puerto $p). Ciérralo con Ctrl + C en su ventana antes de iniciar otro."
      pausa; exit 1
    fi
  done
fi

puerto_ocupado() { (exec 3<>"/dev/tcp/127.0.0.1/$1") 2>/dev/null; }

ip_local() {
  local ip=""
  if command -v ipconfig >/dev/null 2>&1; then
    # interfaz de la ruta por defecto (Wi-Fi o cable), luego en0/en1
    local ifc; ifc="$(route -n get default 2>/dev/null | awk '/interface:/{print $2}')"
    [ -n "$ifc" ] && ip="$(ipconfig getifaddr "$ifc" 2>/dev/null)"
    [ -z "$ip" ] && ip="$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null)"
  fi
  [ -z "$ip" ] && command -v hostname >/dev/null 2>&1 && ip="$(hostname -I 2>/dev/null | awk '{print $1}')"
  echo "$ip"
}

# En macOS el puerto 5000 suele estar tomado por "Receptor de AirPlay": usa otro libre
# (se evita el 5001: Firebase lo reserva para su emulador de Functions)
if puerto_ocupado "$PORT"; then
  ORIG="$PORT"; PORT=5050
  while puerto_ocupado "$PORT" && [ "$PORT" -lt 5100 ]; do PORT=$((PORT + 1)); done
  echo "⚠  El puerto $ORIG está ocupado; usaré el $PORT."
fi

if ! command -v node >/dev/null 2>&1; then
  echo "✖ No encontré Node.js. Instálalo desde https://nodejs.org y vuelve a abrir este archivo."
  pausa; exit 1
fi

# Sesión nueva: identificador único; los navegadores que traigan otro identificador se borran solos
SESSION_ID="$(date +%s)-$RANDOM$RANDOM"
printf '{"id":"%s","debug":%s}\n' "$SESSION_ID" "$PRUEBAS" > "$SESSION_FILE"

IP="$(ip_local)"
clear 2>/dev/null
echo "=============================================="
echo "  LA NOCHE DE LOS TRIÁNGULOS CONGRUENTES"
echo "=============================================="
echo "  Esta compu   : http://localhost:$PORT"
echo "  DASHBOARD    : http://localhost:$PORT/dashboard.html   (solo en esta compu)"
[ -n "$IP" ] && echo "  Otros equipos: http://$IP:$PORT   (misma red Wi-Fi)"
echo "  Servidor   : Node (juego + dashboard del profesor)"
echo "  Sesión nueva: se borra todo el avance anterior en cada equipo."
[ "$PRUEBAS" = true ] && echo "  MODO PRUEBAS: el atajo ?n=3 está habilitado."
echo "  Para detener: Ctrl + C (al detener se cierra la sesión)"
echo "=============================================="
echo

# Cuando el servidor responda: repite la dirección para alumnos (Firebase la empuja hacia arriba) y abre el navegador
(
  curl -s --retry 60 --retry-delay 1 --retry-connrefused -o /dev/null "http://localhost:$PORT/" 2>/dev/null
  sleep 1
  echo
  echo "##############################################"
  echo "#  ALUMNOS: escriban en su navegador"
  if [ -n "$IP" ]; then
    echo "#"
    echo "#      http://$IP:$PORT"
    echo "#"
    echo "#  (misma red Wi-Fi que esta computadora)"
  else
    echo "#  ✖ No detecté la IP: ¿esta compu está conectada a Wi-Fi o cable?"
  fi
  echo "##############################################"
  echo
  if [ -z "$NO_OPEN" ]; then
    START_URL="http://localhost:$PORT/dashboard.html"
    if command -v open >/dev/null 2>&1; then open "$START_URL"
    elif command -v xdg-open >/dev/null 2>&1; then xdg-open "$START_URL" >/dev/null 2>&1
    fi
  fi
) &
OPENER_PID=$!

PORT="$PORT" node server.js
STATUS=$?

[ "$STATUS" -ne 0 ] && { echo; echo "✖ El servidor se detuvo con error ($STATUS)."; pausa; }
exit "$STATUS"
