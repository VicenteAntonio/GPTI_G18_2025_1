"""
Script automatizado para generar audios de meditación cada 24 horas
Utiliza APScheduler para ejecutar el script de generación periódicamente
"""

import os
import sys
import time
from datetime import datetime, timedelta, time as dt_time
from apscheduler.schedulers.blocking import BlockingScheduler
from apscheduler.triggers.cron import CronTrigger
import logging

# Configurar logging
LOG_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "logs")
os.makedirs(LOG_DIR, exist_ok=True)

log_file = os.path.join(LOG_DIR, "audio_scheduler.log")
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(log_file),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

# Agregar el directorio de scripts al path
sys.path.append(os.path.dirname(__file__))

def generate_audio_task():
    """Tarea que ejecuta la generación de audio"""
    logger.info("=" * 70)
    logger.info("🚀 Iniciando generación automática de audios...")
    logger.info(f"⏰ Hora de ejecución: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    logger.info("=" * 70)
    
    try:
        # Importar y ejecutar el generador
        from generate_audio import main as generate_main
        
        # Ejecutar la generación
        generate_main()
        
        logger.info("✅ Generación de audios completada exitosamente")
        
        # Calcular próxima ejecución (24 horas después a las 3:00 AM)
        now = datetime.now()
        tomorrow = now + timedelta(days=1)
        next_run = datetime.combine(tomorrow.date(), dt_time(3, 0))
        logger.info(f"📝 Próxima ejecución: {next_run.strftime('%Y-%m-%d %H:%M:%S')}")
        
    except Exception as e:
        logger.error(f"❌ Error durante la generación de audios: {str(e)}")
        logger.exception("Detalles del error:")
    
    logger.info("=" * 70 + "\n")

def main():
    """Función principal del scheduler"""
    global scheduler
    
    print("=" * 70)
    print("🎵 SCHEDULER DE GENERACIÓN AUTOMÁTICA DE AUDIOS")
    print("=" * 70)
    print(f"📅 Fecha de inicio: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"⏰ Frecuencia: Cada 24 horas")
    print(f"📁 Logs guardados en: {log_file}")
    print("=" * 70)
    print("\n💡 Presiona Ctrl+C para detener el scheduler\n")
    
    # Crear el scheduler
    scheduler = BlockingScheduler()
    
    # Opción 1: Ejecutar cada 24 horas desde ahora
    # scheduler.add_job(
    #     generate_audio_task,
    #     'interval',
    #     hours=24,
    #     next_run_time=datetime.now()  # Ejecutar inmediatamente al iniciar
    # )
    
    # Opción 2: Ejecutar todos los días a las 3:00 AM (recomendado)
    scheduler.add_job(
        generate_audio_task,
        CronTrigger(hour=3, minute=0),  # 3:00 AM todos los días
        id='audio_generation',
        name='Generación de Audios de Meditación',
        replace_existing=True
    )
    
    # También ejecutar inmediatamente al iniciar (opcional)
    # Descomenta la siguiente línea si quieres ejecutar al inicio
    # generate_audio_task()
    
    logger.info("🚀 Scheduler iniciado correctamente")
    
    # Mostrar información del job programado
    jobs = scheduler.get_jobs()
    if jobs:
        job = jobs[0]
        # Calcular próxima ejecución basado en el trigger (3:00 AM)
        now = datetime.now()
        next_run = datetime.combine(now.date(), dt_time(3, 0))
        if next_run <= now:
            next_run += timedelta(days=1)
        logger.info(f"⏰ Próxima ejecución programada: {next_run.strftime('%Y-%m-%d %H:%M:%S')}")
    
    try:
        # Iniciar el scheduler (esto es bloqueante)
        scheduler.start()
    except (KeyboardInterrupt, SystemExit):
        logger.info("\n🛑 Scheduler detenido por el usuario")
        print("\n👋 ¡Hasta luego!")

if __name__ == "__main__":
    main()

