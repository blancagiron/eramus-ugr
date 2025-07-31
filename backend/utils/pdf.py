from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import cm
from reportlab.pdfgen import canvas
from reportlab.platypus import (
    SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT
import os

def generar_pdf_acuerdo(acuerdo):
    email = acuerdo.get('email_estudiante', 'anonimo')
    output_path = f"/tmp/acuerdo_{email}.pdf"

    doc = SimpleDocTemplate(output_path, pagesize=A4,
                            rightMargin=2*cm, leftMargin=2*cm,
                            topMargin=2*cm, bottomMargin=2*cm)

    elements = []
    styles = getSampleStyleSheet()
    
    # Estilos personalizados
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Title'],
        fontSize=16,
        alignment=TA_CENTER,
        spaceAfter=12
    )
    
    subtitle_style = ParagraphStyle(
        'CustomSubtitle',
        parent=styles['Heading4'],
        fontSize=12,
        alignment=TA_CENTER,
        spaceAfter=8,
        spaceBefore=8
    )
    
    normal = styles["Normal"]
    
    # Estilos adicionales para tablas
    small_style = ParagraphStyle(
        'SmallText',
        parent=styles['Normal'],
        fontSize=8,
        alignment=TA_CENTER
    )
    
    tiny_style = ParagraphStyle(
        'TinyText',
        parent=styles['Normal'],
        fontSize=7,
        alignment=TA_CENTER
    )

    # ===== TÍTULO PRINCIPAL =====
    elements.append(Paragraph("Propuesta de Acuerdo de Estudios", title_style))
    elements.append(Paragraph("TUTOR DOCENTE-ESTUDIANTE", subtitle_style))
    elements.append(Spacer(1, 20))
    
    # Nota informativa
    nota_info = """Este documento es de uso interno en la UGR, se cumplimenta a modo de propuesta de programa de estudios durante la movilidad con el tutor designado por Centro. Los Centros podrán usar un modelo o procedimiento alternativo para la elaboración del borrador. NO es el Learning Agreement que firma la Universidad de acogida."""
    elements.append(Paragraph(nota_info, normal))
    elements.append(Spacer(1, 20))

    # ===== DATOS PERSONALES =====
    elements.append(Paragraph("Datos Personales", subtitle_style))
    dp = acuerdo.get("datos_personales", {})

    # Función para truncar texto largo
    def truncate_field(text, max_length=30):
        if text and len(str(text)) > max_length:
            return str(text)[:max_length-3] + "..."
        return str(text) if text else ""

    # Calcular anchos dinámicamente
    page_width = A4[0] - 4*cm
    label_width = page_width * 0.2
    data_width = page_width * 0.3

    # Separar apellidos si existen
    apellidos = dp.get("apellidos", "").split() if dp.get("apellidos", "") else ["", ""]
    primer_apellido = apellidos[0] if len(apellidos) > 0 else ""
    segundo_apellido = apellidos[1] if len(apellidos) > 1 else ""

    # Tabla de datos personales con el formato original
    user_table_data = [
        [Paragraph("<b>1er Apellido</b>", tiny_style), 
         Paragraph(truncate_field(primer_apellido), tiny_style), 
         Paragraph("<b>2º Apellido</b>", tiny_style), 
         Paragraph(truncate_field(segundo_apellido), tiny_style)],
        [Paragraph("<b>Nombre</b>", tiny_style), 
         Paragraph(truncate_field(dp.get("nombre", "")), tiny_style), 
         Paragraph("<b>DNI / NIF</b>", tiny_style), 
         Paragraph(truncate_field(dp.get("dni", "")), tiny_style)],
        [Paragraph("<b>Grado en la UGR</b>", tiny_style), 
         Paragraph(truncate_field(dp.get("grado", ""), 35), tiny_style), 
         Paragraph("<b>Correo electrónico</b>", tiny_style), 
         Paragraph(truncate_field(dp.get("email", email), 35), tiny_style)]
    ]
    
    tabla_user = Table(user_table_data, colWidths=[label_width, data_width, label_width, data_width])
    tabla_user.setStyle(TableStyle([
        ("BOX", (0, 0), (-1, -1), 0.5, colors.black),
        ("INNERGRID", (0, 0), (-1, -1), 0.25, colors.black),
        ("BACKGROUND", (0, 0), (0, -1), colors.lightgrey),
        ("BACKGROUND", (2, 0), (2, -1), colors.lightgrey),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("ALIGN", (0, 0), (-1, -1), "LEFT"),
        ("FONTSIZE", (0, 0), (-1, -1), 8),
    ]))
    elements.append(tabla_user)
    elements.append(Spacer(1, 20))

    # ===== DATOS DE MOVILIDAD =====
    elements.append(Paragraph("Datos movilidad", subtitle_style))
    dm = acuerdo.get("datos_movilidad", {})

    # Construir datos de la tabla con spans apropiados
    movilidad_data = [
        [Paragraph("<b>Programa</b>", tiny_style), 
         Paragraph(truncate_field(f"ERASMUS +/Programa Propio: {dm.get('programa', '')}", 60), tiny_style), 
         Paragraph("<b>Curso Académico</b>", tiny_style), 
         Paragraph(truncate_field(dm.get("curso_academico", "")), tiny_style)],
        
        [Paragraph("<b>Universidad de destino</b>", tiny_style), 
         Paragraph(truncate_field(dm.get("nombre_universidad", ""), 70), tiny_style), 
         "", ""],
        
        [Paragraph("<b>Código univer. destino</b>", tiny_style), 
         Paragraph(truncate_field(dm.get("codigo_universidad", acuerdo.get("destino_codigo", ""))), tiny_style), 
         Paragraph("<b>País</b>", tiny_style), 
         Paragraph(truncate_field(dm.get("pais", "")), tiny_style)],
        
        [Paragraph("<b>Periodo de estudios</b>", tiny_style), 
         Paragraph(truncate_field(f"Curso completo / 1er cuatrimestre / 2º cuatrimestre: {dm.get('periodo_estudios', '')}", 70), tiny_style), 
         "", ""],
        
        [Paragraph("<b>Responsable Académico</b>", tiny_style), 
         Paragraph(truncate_field(dm.get("responsable", ""), 70), tiny_style), 
         "", ""],
        
        [Paragraph("<b>Tutor Docente</b>", tiny_style), 
         Paragraph(truncate_field(dm.get("tutor", ""), 70), tiny_style), 
         "", ""],
        
        [Paragraph("<b>Email Tutor Docente</b>", tiny_style), 
         Paragraph(truncate_field(dm.get("email_tutor", ""), 70), tiny_style), 
         "", ""]
    ]
    
    # Anchos de columna adaptables
    col1_width = page_width * 0.25  # Etiquetas
    col2_width = page_width * 0.45  # Datos principales
    col3_width = page_width * 0.15  # Etiquetas secundarias
    col4_width = page_width * 0.15  # Datos secundarios
    
    tabla_mov = Table(movilidad_data, colWidths=[col1_width, col2_width, col3_width, col4_width])
    tabla_mov.setStyle(TableStyle([
        ("BOX", (0, 0), (-1, -1), 0.5, colors.black),
        ("INNERGRID", (0, 0), (-1, -1), 0.25, colors.black),
        ("BACKGROUND", (0, 0), (0, -1), colors.lightgrey),
        ("BACKGROUND", (2, 0), (2, -1), colors.lightgrey),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("ALIGN", (0, 0), (-1, -1), "LEFT"),
        ("FONTSIZE", (0, 0), (-1, -1), 8),
        
        # Combinar celdas para campos largos
        ("SPAN", (1, 1), (3, 1)),  # Universidad de destino
        ("SPAN", (1, 3), (3, 3)),  # Periodo de estudios  
        ("SPAN", (1, 4), (3, 4)),  # Responsable Académico
        ("SPAN", (1, 5), (3, 5)),  # Tutor Docente
        ("SPAN", (1, 6), (3, 6)),  # Email Tutor Docente
    ]))
    elements.append(tabla_mov)
    elements.append(Spacer(1, 20))

    # ===== TABLA DE ASIGNATURAS =====
    bloques = acuerdo.get("bloques", [])

    if not bloques:
        elements.append(Paragraph("No hay asignaturas añadidas.", normal))
    else:
        # Función para truncar texto si es muy largo
        def truncate_text(text, max_length=50):
            if len(text) > max_length:
                return text[:max_length-3] + "..."
            return text

        # Cabeceras principales
        header_ugr = Paragraph("<b>Estudios a reconocer en la UNIVERSIDAD DE GRANADA</b><br/><font size=6>COLOQUE DEBAJO DEL NOMBRE DE CADA ASIGNATURA EL ENLACE A SU GUÍA DOCENTE EN LA UGR</font>", small_style)
        header_dest = Paragraph("<b>Estudios a realizar en la UNIVERSIDAD DE DESTINO</b><br/><font size=6>COLOQUE DEBAJO DEL NOMBRE DE CADA ASIGNATURA EL ENLACE A SU GUÍA DOCENTE EN LA UNIVERSIDAD DE DESTINO</font>", small_style)
        
        # Primera fila: cabeceras principales
        headers_main = [header_ugr, "", "", "", "", header_dest, "", ""]
        
        # Segunda fila: subcabeceras nivel 1
        headers_sub1 = [
            Paragraph("<b>Nombre de la Asignatura</b>", tiny_style),
            Paragraph("<b>Curso</b>", tiny_style),
            Paragraph("<b>Semestre (1º o 2º)</b>", tiny_style),
            Paragraph("<b>Créditos</b>", tiny_style),
            "",
            Paragraph("<b>Name of Subject</b>", tiny_style),
            Paragraph("<b>Course</b>", tiny_style),
            Paragraph("<b>Créditos ECTS o locales</b>", tiny_style)
        ]
        
        # Tercera fila: subcabeceras nivel 2 (solo para créditos UGR)
        headers_sub2 = [
            "",
            "",
            "",
            Paragraph("<b>ECTS</b>", tiny_style),
            Paragraph("<b>FO/F<br/>B/OP<br/>T*</b>", tiny_style),
            "",
            "",
            ""
        ]

        table_data = [headers_main, headers_sub1, headers_sub2]

        # Datos por bloque
        for b in bloques:
            ugr = b.get("asignaturas_ugr", [{}])[0] if b.get("asignaturas_ugr") else {}
            dest = b.get("asignaturas_destino", [{}])[0] if b.get("asignaturas_destino") else {}

            # Truncar nombres largos y crear párrafos pequeños
            nombre_ugr = truncate_text(ugr.get('nombre', ''), 40)
            nombre_dest = truncate_text(dest.get('nombre', ''), 40)
            
            fila = [
                Paragraph(nombre_ugr, tiny_style),
                Paragraph(str(ugr.get('curso', '')), tiny_style),
                Paragraph(str(ugr.get('semestre', '')), tiny_style),
                Paragraph(str(ugr.get('ects', '')), tiny_style),
                Paragraph(str(ugr.get('tipo', '')), tiny_style),
                Paragraph(nombre_dest, tiny_style),
                Paragraph(str(dest.get('curso', '')), tiny_style),
                Paragraph(str(dest.get('ects', '')), tiny_style)
            ]
            table_data.append(fila)

        # Fila de totales
        try:
            total_ugr = sum(float(b["asignaturas_ugr"][0].get("ects", 0)) for b in bloques if b.get("asignaturas_ugr") and b["asignaturas_ugr"][0].get("ects"))
            total_dest = sum(float(b["asignaturas_destino"][0].get("ects", 0)) for b in bloques if b.get("asignaturas_destino") and b["asignaturas_destino"][0].get("ects"))
        except (ValueError, TypeError):
            total_ugr = 0
            total_dest = 0
        
        fila_total = [
            Paragraph("<b>TOTAL CRÉDITOS</b>", tiny_style), 
            "", 
            "", 
            Paragraph(f"<b>{total_ugr}</b>", tiny_style), 
            "", 
            Paragraph("<b>TOTAL CRÉDITOS</b>", tiny_style), 
            "", 
            Paragraph(f"<b>{total_dest}</b>", tiny_style)
        ]
        table_data.append(fila_total)

        # Calcular anchos de columna dinámicamente
        page_width = A4[0] - 4*cm  # Ancho disponible menos márgenes
        col_widths = [
            page_width * 0.25,  # Nombre asignatura UGR
            page_width * 0.08,  # Curso UGR
            page_width * 0.08,  # Semestre UGR
            page_width * 0.08,  # ECTS UGR
            page_width * 0.08,  # Tipo UGR
            page_width * 0.25,  # Nombre asignatura Destino
            page_width * 0.08,  # Curso Destino
            page_width * 0.10   # ECTS Destino
        ]

        # Crear tabla
        tabla_asignaturas = Table(table_data, colWidths=col_widths)

        tabla_asignaturas.setStyle(TableStyle([
            # Bordes
            ("BOX", (0, 0), (-1, -1), 0.5, colors.black),
            ("INNERGRID", (0, 0), (-1, -1), 0.25, colors.black),
            
            # Cabeceras principales (primera fila)
            ("SPAN", (0, 0), (4, 0)),  # UGR
            ("SPAN", (5, 0), (7, 0)),  # Destino
            
            # Spans para subcabeceras
            ("SPAN", (0, 1), (0, 2)),  # Nombre asignatura UGR
            ("SPAN", (1, 1), (1, 2)),  # Curso UGR
            ("SPAN", (2, 1), (2, 2)),  # Semestre UGR
            ("SPAN", (5, 1), (5, 2)),  # Nombre asignatura Destino
            ("SPAN", (6, 1), (6, 2)),  # Curso Destino
            ("SPAN", (7, 1), (7, 2)),  # ECTS Destino
            
            # Span para totales
            ("SPAN", (0, -1), (2, -1)),  # Total UGR
            ("SPAN", (5, -1), (6, -1)),  # Total Destino
            
            # Fondos
            ("BACKGROUND", (0, 0), (-1, 2), colors.lightgrey),
            ("BACKGROUND", (0, -1), (-1, -1), colors.lightgrey),
            
            # Alineaciones
            ("ALIGN", (0, 0), (-1, 2), "CENTER"),
            ("ALIGN", (0, -1), (-1, -1), "CENTER"),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            
            # Tamaño de fuente pequeño para que quepa todo
            ("FONTSIZE", (0, 0), (-1, -1), 7),
        ]))

        elements.append(tabla_asignaturas)
        elements.append(Spacer(1, 20))

        # Nota al pie
        nota_pie = """*FO (Formación Obligatoria) FB (Formación Básica) OPT (Optatividad)
        
* CUANDO EN EL DESTINO LAS HORAS DE TRABAJO DEL ESTUDIANTE NO SE MIDAN EN CRÉDITOS ECTS, PROPORCIONE UN ENLACE CON INFORMACIÓN SOBRE EL SISTEMA DE CRÉDITOS EN DESTINO: _______________________, E INDIQUE A CONTINUACIÓN A CUÁNTOS CRÉDITOS EN DESTINO EQUIVALE CADA CRÉDITO ECTS: _______________________"""
        
        elements.append(Paragraph(nota_pie, normal))
        elements.append(Spacer(1, 30))

    # ===== FIRMAS =====
    elements.append(Spacer(1, 20))
    firma_table = [
        [Paragraph("<b>Firma Tutor/a Docente</b>", tiny_style), 
         Paragraph("<b>Fecha:</b>", tiny_style)],
        [Paragraph("", tiny_style), Paragraph("", tiny_style)]
    ]
    
    # Anchos para firmas
    firma_width = page_width * 0.5
    
    tabla_firma = Table(firma_table, colWidths=[firma_width, firma_width])
    tabla_firma.setStyle(TableStyle([
        ("BOX", (0, 0), (-1, -1), 0.5, colors.black),
        ("INNERGRID", (0, 0), (-1, -1), 0.25, colors.black),
        ("BACKGROUND", (0, 0), (-1, 0), colors.lightgrey),
        ("ALIGN", (0, 0), (-1, 0), "CENTER"),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("FONTSIZE", (0, 0), (-1, -1), 8),
        # Altura mínima para las firmas
        ("ROWBACKGROUNDS", (0, 1), (-1, 1), [colors.white]),
    ]))
    elements.append(tabla_firma)

    # ===== INFORMACIÓN DE PROTECCIÓN DE DATOS =====
    elements.append(Spacer(1, 20))
    elements.append(Paragraph("Información básica sobre protección de datos", subtitle_style))
    
    # Anchos para protección de datos
    label_width_pd = page_width * 0.25
    data_width_pd = page_width * 0.75
    
    proteccion_data = [
        [Paragraph("<b>Responsable</b>", tiny_style), 
         Paragraph("UNIVERSIDAD DE GRANADA", tiny_style)],
        
        [Paragraph("<b>Finalidad</b>", tiny_style), 
         Paragraph("Gestión de su declaración responsable como participante en programas de movilidad internacional de la UGR", tiny_style)],
        
        [Paragraph("<b>Legitimación</b>", tiny_style), 
         Paragraph("Art. 6.1. e) RGPD: Cumplimiento de una misión realizada en interés público o en el ejercicio de poderes públicos conferidos al responsable del tratamiento.", tiny_style)],
        
        [Paragraph("<b>Destinatarios</b>", tiny_style), 
         Paragraph("No se prevé la cesión de los datos", tiny_style)],
        
        [Paragraph("<b>Derechos</b>", tiny_style), 
         Paragraph("La persona interesada tiene derecho a solicitar el acceso, rectificación, supresión, oposición y limitación de sus datos, como se explica en la información adicional", tiny_style)],
        
        [Paragraph("<b>Información Adicional</b>", tiny_style), 
         Paragraph("La información adicional y detallada se encuentra disponible en el siguiente enlace: https://secretariageneral.ugr.es/pages/proteccion_datos/leyendas-informativas/_img/informacionadicionalmovilidad/", tiny_style)]
    ]
    
    tabla_proteccion = Table(proteccion_data, colWidths=[label_width_pd, data_width_pd])
    tabla_proteccion.setStyle(TableStyle([
        ("BOX", (0, 0), (-1, -1), 0.25, colors.black),
        ("INNERGRID", (0, 0), (-1, -1), 0.25, colors.black),
        ("BACKGROUND", (0, 0), (0, -1), colors.lightgrey),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("ALIGN", (0, 0), (-1, -1), "LEFT"),
        ("FONTSIZE", (0, 0), (-1, -1), 7),
    ]))
    elements.append(tabla_proteccion)

    # ===== GENERAR DOCUMENTO =====
    doc.build(elements)
    return output_path