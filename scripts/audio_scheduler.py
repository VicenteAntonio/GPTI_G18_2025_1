"""
Script automatizado para generar audios de meditación cada 24 horas y 1 minuto
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
        
        # Calcular próxima ejecución (24 horas y 1 minuto después)
        now = datetime.now()
        next_run = now + timedelta(hours=24, minutes=1)
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
    print(f"⏰ Frecuencia: Cada 24 horas y 1 minuto")
    print(f"📁 Logs guardados en: {log_file}")
    print("=" * 70)
    print("\n💡 Presiona Ctrl+C para detener el scheduler\n")
    
    # Crear el scheduler
    scheduler = BlockingScheduler()
    
    # Ejecutar cada 24 horas y 1 minuto (1440 minutos + 1 minuto = 1441 minutos)
    scheduler.add_job(
        generate_audio_task,
        'interval',
        minutes=1441,  # 24 horas y 1 minuto
        next_run_time=datetime.now(),  # Ejecutar inmediatamente al iniciar
        id='audio_generation',
        name='Generación de Audios de Meditación',
        replace_existing=True
    )
    
    logger.info("🚀 Scheduler iniciado correctamente")
    logger.info(f"⏰ Intervalo configurado: 24 horas y 1 minuto (1441 minutos)")
    
    # Mostrar información del job programado
    jobs = scheduler.get_jobs()
    if jobs:
        job = jobs[0]
        next_run = job.next_run_time
        if next_run:
            logger.info(f"⏰ Primera ejecución: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} (inmediata)")
            logger.info(f"⏰ Próxima ejecución: {next_run.strftime('%Y-%m-%d %H:%M:%S')}")
    
    try:
        # Iniciar el scheduler (esto es bloqueante)
        scheduler.start()
    except (KeyboardInterrupt, SystemExit):
        logger.info("\n🛑 Scheduler detenido por el usuario")
        print("\n👋 ¡Hasta luego!")

if __name__ == "__main__":
    main()

