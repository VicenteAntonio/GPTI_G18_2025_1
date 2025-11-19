# Textos de meditación guiada para cada categoría

MEDITATION_TEXTS = {
    "sleep-test": """
        Bienvenido a esta breve sesión de sueño. Cierra los ojos y respira profundamente. Inhala... exhala. 
        Deja que tu cuerpo se relaje completamente. Buenas noches.
    """,
    
    "relaxation-morning": """
        Bienvenido a esta sesión de relajación matutina. Encuentra una posición cómoda y cierra los ojos suavemente.
        
        Respira profundamente... Inhala por la nariz, llenando tus pulmones de aire fresco y renovador. 
        Exhala lentamente por la boca, liberando cualquier tensión que puedas sentir.
        
        Continúa respirando a tu propio ritmo. Con cada inhalación, imagina que traes paz y tranquilidad a tu ser. 
        Con cada exhalación, liberas el estrés y las preocupaciones.
        
        Ahora, lleva tu atención a tu cuerpo. Comienza por tus pies. Siente cómo se relajan completamente. 
        Deja que esa sensación de relajación suba por tus piernas, tus caderas, tu abdomen.
        
        Relaja tu pecho, tus hombros. Deja que tus brazos y manos se vuelvan completamente livianos. 
        Relaja tu cuello, tu mandíbula, tu frente. Todo tu cuerpo está en un estado de profunda relajación.
        
        Imagina que estás en un lugar hermoso y tranquilo. Puede ser una playa, un bosque, un jardín. 
        Observa los colores, escucha los sonidos suaves, siente la paz de este lugar.
        
        Permanece aquí unos momentos más, respirando suavemente, sintiendo esta paz profunda.
        
        Ahora, lentamente, comienza a volver al presente. Mueve suavemente tus dedos de las manos y los pies. 
        Cuando estés listo, abre los ojos. Llevas contigo esta sensación de paz y tranquilidad para el resto de tu día.
        
        Gracias por practicar conmigo. Que tengas un día maravilloso.
    """,
    
    "selfawareness-mindful": """
        Bienvenido a esta práctica de consciencia plena. Encuentra un lugar cómodo para sentarte o acostarte.
        
        Cierra los ojos y comienza a prestar atención a tu respiración. Sin cambiarla, simplemente observa. 
        Observa cómo el aire entra y sale de tu cuerpo de forma natural.
        
        Nota la sensación del aire fresco cuando inhalas, y el aire cálido cuando exhalas. 
        Cada respiración es única, cada momento es nuevo.
        
        Ahora, expande tu consciencia a las sensaciones de tu cuerpo. ¿Qué sientes en este momento? 
        Tal vez notes el contacto de tu cuerpo con la superficie donde estás. Quizás sientas la temperatura del aire. 
        Simplemente observa, sin juzgar.
        
        Si tu mente divaga, está bien. Es natural. Cuando notes que tu atención se ha ido, 
        con amabilidad y sin crítica, vuelve a traerla al momento presente, a tu respiración.
        
        Ahora, lleva tu consciencia a tus pensamientos. Observa cómo aparecen y desaparecen, 
        como nubes que pasan por el cielo. No te aferres a ellos, simplemente obsérvalos.
        
        Reconoce que tú no eres tus pensamientos. Eres el observador, la consciencia que los percibe. 
        En este espacio de observación, hay paz y claridad.
        
        Lleva tu atención de nuevo a tu respiración. Inhala profundamente, sintiendo cómo el aire llena tu ser. 
        Exhala completamente, liberando todo lo que ya no necesitas.
        
        Toma un momento para agradecer este tiempo que te has dedicado. 
        Agradece a tu cuerpo, a tu mente, a ti mismo por estar presente.
        
        Lentamente, comienza a volver. Mueve suavemente tus manos y tus pies. 
        Cuando estés listo, abre los ojos, llevando contigo esta consciencia plena al resto de tu día.
        
        Gracias por esta práctica. Namaste.
    """
}

def get_meditation_text(session_id):
    """Obtiene el texto de meditación para una sesión específica"""
    return MEDITATION_TEXTS.get(session_id, "").strip()

