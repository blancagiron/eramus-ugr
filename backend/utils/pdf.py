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

   # Obtener apellidos desde campos individuales
    primer_apellido = dp.get("primer_apellido", "")
    segundo_apellido = dp.get("segundo_apellido", "")
    grado = dp.get("grado", "")

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
         Paragraph(truncate_field(grado), tiny_style), 
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

    # ===== DATOS DE MOVILIDAD - FORMATO MEJORADO =====
    elements.append(Paragraph("Datos movilidad", subtitle_style))
    dm = acuerdo.get("datos_movilidad", {})

    # Tabla de movilidad con formato similar a la imagen
    page_width = A4[0] - 4*cm
    
    # Primera fila: Programa, vacío, Curso Académico
    fila1 = [
        Paragraph("<b>Programa</b>", small_style),
        Paragraph(truncate_field(dm.get('programa', 'ERASMUS+'), 40), small_style),
        Paragraph("<b>Curso Académico</b>", small_style),
        Paragraph(truncate_field(dm.get("curso_academico", "2023/24")), small_style)
    ]
    
    # Segunda fila: Universidad de destino (span completo)
    fila2 = [
        Paragraph("<b>Universidad de destino</b>", small_style),
        Paragraph(truncate_field(dm.get("nombre_universidad", ""), 80), small_style),
        "",
        ""
    ]
    
    # Tercera fila: Código universidad, vacío, País
    fila3 = [
        Paragraph("<b>Código univer. destino</b>", small_style),
        Paragraph(truncate_field(dm.get("codigo_universidad", acuerdo.get("destino_codigo", "P COIMBRA05"))), small_style),
        Paragraph("<b>País</b>", small_style),
        Paragraph(truncate_field(dm.get("pais", "Portugal")), small_style)
    ]
    
    # Cuarta fila: Periodo de estudios (span completo)
    fila4 = [
        Paragraph("<b>Periodo de estudios</b>", small_style),
        Paragraph(truncate_field(dm.get('periodo_estudios', '1er cuatrimestre'), 80), small_style),
        "",
        ""
    ]
    
    # Quinta fila: Responsable Académico (span completo)
    fila5 = [
        Paragraph("<b>Responsable Académico</b>", small_style),
        Paragraph(truncate_field(dm.get("responsable", "María"), 80), small_style),
        "",
        ""
    ]
    
    # Sexta fila: Tutor Docente (span completo)
    fila6 = [
        Paragraph("<b>Tutor Docente</b>", small_style),
        Paragraph(truncate_field(dm.get("tutor", "Juana"), 80), small_style),
        "",
        ""
    ]
    
    # Séptima fila: Email Tutor Docente (span completo)
    fila7 = [
        Paragraph("<b>Email Tutor Docente</b>", small_style),
        Paragraph(truncate_field(dm.get("email_tutor", ""), 80), small_style),
        "",
        ""
    ]

    movilidad_data = [fila1, fila2, fila3, fila4, fila5, fila6, fila7]
    
    # Anchos: 25%, 35%, 20%, 20%
    col_widths = [
        page_width * 0.25,
        page_width * 0.35, 
        page_width * 0.20,
        page_width * 0.20
    ]
    
    tabla_mov = Table(movilidad_data, colWidths=col_widths)
    tabla_mov.setStyle(TableStyle([
        ("BOX", (0, 0), (-1, -1), 1, colors.black),
        ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.black),
        
        # Fondo gris para etiquetas
        ("BACKGROUND", (0, 0), (0, 0), colors.lightgrey),  # Programa
        ("BACKGROUND", (2, 0), (2, 0), colors.lightgrey),  # Curso Académico
        ("BACKGROUND", (0, 1), (0, 1), colors.lightgrey),  # Universidad destino
        ("BACKGROUND", (0, 2), (0, 2), colors.lightgrey),  # Código universidad
        ("BACKGROUND", (2, 2), (2, 2), colors.lightgrey),  # País
        ("BACKGROUND", (0, 3), (0, 3), colors.lightgrey),  # Periodo estudios
        ("BACKGROUND", (0, 4), (0, 4), colors.lightgrey),  # Responsable
        ("BACKGROUND", (0, 5), (0, 5), colors.lightgrey),  # Tutor
        ("BACKGROUND", (0, 6), (0, 6), colors.lightgrey),  # Email tutor
        
        # Spans para campos largos
        ("SPAN", (1, 1), (3, 1)),  # Universidad de destino
        ("SPAN", (1, 3), (3, 3)),  # Periodo de estudios
        ("SPAN", (1, 4), (3, 4)),  # Responsable Académico
        ("SPAN", (1, 5), (3, 5)),  # Tutor Docente
        ("SPAN", (1, 6), (3, 6)),  # Email Tutor Docente
        
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("FONTSIZE", (0, 0), (-1, -1), 9),
    ]))
    elements.append(tabla_mov)
    elements.append(Spacer(1, 20))

    # ===== TABLA DE ASIGNATURAS - MEJORADA CON SPANS BIDIRECCIONALES =====
    bloques = acuerdo.get("bloques", [])

    if not bloques:
        elements.append(Paragraph("No hay asignaturas añadidas.", normal))
    else:
        # Función para truncar texto si es muy largo
        def truncate_text(text, max_length=35):
            if len(text) > max_length:
                return text[:max_length-3] + "..."
            return text

        # Estructura de la tabla corregida
        # Primera fila: Headers principales
        header1 = [
            Paragraph("<b>Estudios a reconocer en la UNIVERSIDAD DE GRANADA</b><br/><font size=6>COLOQUE DEBAJO DEL NOMBRE DE CADA ASIGNATURA EL ENLACE A SU GUÍA DOCENTE EN LA UGR</font>", tiny_style),
            "", "", "", "",
            Paragraph("<b>Estudios a realizar en la UNIVERSIDAD DE DESTINO</b><br/><font size=6>COLOQUE DEBAJO DEL NOMBRE DE CADA ASIGNATURA EL ENLACE A SU GUÍA DOCENTE EN LA UNIVERSIDAD DE DESTINO</font>", tiny_style),
            "", ""
        ]
        
        # Segunda fila: Headers secundarios - CORREGIDA
        header2 = [
            Paragraph("<b>Nombre de la Asignatura</b>", tiny_style),
            Paragraph("<b>Curso</b>", tiny_style),
            Paragraph("<b>Semestre (1º o 2º)</b>", tiny_style),
            Paragraph("<b>Créditos</b>", tiny_style),  # Este se dividirá en la fila 3
            "",  # Espacio para la segunda columna de créditos
            Paragraph("<b>Name of Subject</b>", tiny_style),
            Paragraph("<b>Course</b>", tiny_style),
            Paragraph("<b>Créditos ECTS o locales</b>", tiny_style)
        ]
        
        # Tercera fila: Sub-headers solo para la columna de créditos de UGR
        header3 = [
            "", "", "",  # Nombres, curso y semestre no se dividen
            Paragraph("<b>ECTS</b>", tiny_style),
            Paragraph("<b>FO/FB/OP/T*</b>", tiny_style),
            "", "", ""  # Las columnas de destino no se dividen
        ]

        table_data = [header1, header2, header3]

        # ===== PROCESAMIENTO MEJORADO DE BLOQUES CON SPANS BIDIRECCIONALES =====
        def procesar_bloque_mejorado(bloque):
            asignaturas_ugr = bloque.get("asignaturas_ugr", [])
            asignaturas_destino = bloque.get("asignaturas_destino", [])
            
            num_ugr = len(asignaturas_ugr)
            num_destino = len(asignaturas_destino)
            
            # Determinar el número máximo de filas necesarias
            max_filas = max(num_ugr, num_destino)
            
            filas_bloque = []
            spans_necesarios = []
            
            # Crear todas las filas del bloque
            for i in range(max_filas):
                ugr = asignaturas_ugr[i] if i < num_ugr else {}
                dest = asignaturas_destino[i] if i < num_destino else {}
                
                # Procesar UGR
                ugr_nombre = ugr.get('nombre', '') if ugr else ''
                if ugr_nombre:
                    ugr_url = ugr.get('enlace') or ugr.get('guia')
                    if ugr_url:
                        ugr_nombre = f'<a href="{ugr_url}" color="blue">{truncate_text(ugr_nombre)}</a>'
                    else:
                        ugr_nombre = truncate_text(ugr_nombre)

                # Procesar destino
                dest_nombre = dest.get('nombre', '') if dest else ''
                if dest_nombre:
                    dest_url = dest.get('guia')
                    if dest_url:
                        dest_nombre = f'<a href="{dest_url}" color="blue">{truncate_text(dest_nombre)}</a>'
                    else:
                        dest_nombre = truncate_text(dest_nombre)

                fila = [
                    Paragraph(ugr_nombre, tiny_style),
                    Paragraph(str(ugr.get('curso', '')) if ugr else "", tiny_style),
                    Paragraph(str(ugr.get('semestre', '')) if ugr else "", tiny_style),
                    Paragraph(str(ugr.get('ects', '')) if ugr else "", tiny_style),
                    Paragraph(str(ugr.get('tipo', '')) if ugr else "", tiny_style),
                    Paragraph(dest_nombre, tiny_style),
                    Paragraph(str(dest.get('curso', '')) if dest else "", tiny_style),
                    Paragraph(str(dest.get('ects', '')) if dest else "", tiny_style)
                ]
                
                filas_bloque.append(fila)
            
            # Calcular spans para asignaturas UGR (cuando hay menos UGR que destino)
            if num_ugr < num_destino and num_ugr > 0:
                filas_por_ugr = num_destino // num_ugr
                filas_extra = num_destino % num_ugr
                
                fila_actual = 0
                for i in range(num_ugr):
                    filas_a_ocupar = filas_por_ugr + (1 if i < filas_extra else 0)
                    
                    if filas_a_ocupar > 1:
                        fila_fin = fila_actual + filas_a_ocupar - 1
                        # Añadir spans para las columnas UGR (0-4)
                        for col in range(5):
                            spans_necesarios.append((col, fila_actual, col, fila_fin))
                    
                    fila_actual += filas_a_ocupar
            
            # Calcular spans para asignaturas DESTINO (cuando hay menos destino que UGR)
            elif num_destino < num_ugr and num_destino > 0:
                filas_por_destino = num_ugr // num_destino
                filas_extra = num_ugr % num_destino
                
                fila_actual = 0
                for i in range(num_destino):
                    filas_a_ocupar = filas_por_destino + (1 if i < filas_extra else 0)
                    
                    if filas_a_ocupar > 1:
                        fila_fin = fila_actual + filas_a_ocupar - 1
                        # Añadir spans para las columnas DESTINO (5-7)
                        for col in range(5, 8):
                            spans_necesarios.append((col, fila_actual, col, fila_fin))
                    
                    fila_actual += filas_a_ocupar
            
            return filas_bloque, spans_necesarios

        # Procesar todos los bloques y recopilar spans
        filas_bloques = []
        todos_los_spans = []
        
        for bloque in bloques:
            filas_del_bloque, spans_del_bloque = procesar_bloque_mejorado(bloque)
            
            # Ajustar los índices de las filas de los spans según la posición en la tabla
            fila_offset = len(table_data) + len(filas_bloques)
            spans_ajustados = []
            for col_start, row_start, col_end, row_end in spans_del_bloque:
                spans_ajustados.append((col_start, row_start + fila_offset, col_end, row_end + fila_offset))
            
            filas_bloques.extend(filas_del_bloque)
            todos_los_spans.extend(spans_ajustados)

        table_data.extend(filas_bloques)

        # ===== CÁLCULO DE TOTALES MEJORADO =====
        total_ugr_ects = 0
        total_dest_ects = 0
        
        for bloque in bloques:
            # Sumar créditos de UGR
            for ugr in bloque.get("asignaturas_ugr", []):
                try:
                    ects = float(ugr.get("ects", 0))
                    total_ugr_ects += ects
                except (ValueError, TypeError):
                    pass
            
            # Sumar créditos de destino
            for dest in bloque.get("asignaturas_destino", []):
                try:
                    ects = float(dest.get("ects", 0))
                    total_dest_ects += ects
                except (ValueError, TypeError):
                    pass
        
        # Fila de totales
        fila_total = [
            Paragraph("<b>TOTAL CRÉDITOS</b>", tiny_style), 
            "", 
            "", 
            Paragraph(f"<b>{total_ugr_ects}</b>", tiny_style), 
            "", 
            Paragraph("<b>TOTAL CRÉDITOS</b>", tiny_style), 
            "", 
            Paragraph(f"<b>{total_dest_ects}</b>", tiny_style)
        ]
        table_data.append(fila_total)

        # Anchos de columna optimizados
        col_widths = [
            page_width * 0.22,  # Nombre asignatura UGR
            page_width * 0.08,  # Curso UGR  
            page_width * 0.10,  # Semestre UGR
            page_width * 0.08,  # ECTS UGR
            page_width * 0.10,  # Tipo UGR
            page_width * 0.22,  # Nombre asignatura Destino
            page_width * 0.08,  # Curso Destino
            page_width * 0.12   # ECTS Destino
        ]

        tabla_asignaturas = Table(table_data, colWidths=col_widths)

        # ===== ESTILO CORREGIDO CON SPANS DINÁMICOS =====
        tabla_asignaturas.setStyle(TableStyle([
            # Bordes
            ("BOX", (0, 0), (-1, -1), 1, colors.black),
            ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.black),
            
            # Spans para headers principales (fila 0)
            ("SPAN", (0, 0), (4, 0)),  # Header UGR completo
            ("SPAN", (5, 0), (7, 0)),  # Header Destino completo
            
            # Spans corregidos para fila 1 - solo las columnas que NO se dividen
            ("SPAN", (0, 1), (0, 2)),  # Nombre asignatura UGR (1 fila -> 2 filas)
            ("SPAN", (1, 1), (1, 2)),  # Curso UGR (1 fila -> 2 filas)  
            ("SPAN", (2, 1), (2, 2)),  # Semestre UGR (1 fila -> 2 filas)
            # IMPORTANTE: Créditos UGR en fila 1 abarca las dos columnas (3,4) pero NO se extiende a fila 2
            ("SPAN", (3, 1), (4, 1)),  # "Créditos" header solo en fila 1
            # Las columnas de destino tampoco se dividen
            ("SPAN", (5, 1), (5, 2)),  # Nombre asignatura Destino (1 fila -> 2 filas)
            ("SPAN", (6, 1), (6, 2)),  # Curso Destino (1 fila -> 2 filas)
            ("SPAN", (7, 1), (7, 2)),  # ECTS Destino (1 fila -> 2 filas)
            
            # Spans para totales (última fila)
            ("SPAN", (0, -1), (2, -1)),  # Total UGR label
            ("SPAN", (3, -1), (4, -1)),  # Total UGR value
            ("SPAN", (5, -1), (6, -1)),  # Total Destino label
            
            # Fondos grises
            ("BACKGROUND", (0, 0), (-1, 2), colors.lightgrey),
            ("BACKGROUND", (0, -1), (-1, -1), colors.lightgrey),
            
            # Alineaciones
            ("ALIGN", (0, 0), (-1, 2), "CENTER"),
            ("ALIGN", (0, -1), (-1, -1), "CENTER"),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            
            # Tamaño de fuente
            ("FONTSIZE", (0, 0), (-1, -1), 8),
        ]))
        
        # Añadir los spans dinámicos para los bloques personalizados
        for col_start, row_start, col_end, row_end in todos_los_spans:
            tabla_asignaturas.setStyle(TableStyle([
                ("SPAN", (col_start, row_start), (col_end, row_end)),
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
     # ===== FIRMAS =====
    elements.append(Spacer(1, 20))
    firma_table = [
        [Paragraph("<b>Firma Tutor/a Docente</b>", tiny_style)],
        [Paragraph("", tiny_style)],
        [Paragraph("<b>Fecha:</b>", tiny_style)],
        [Paragraph("", tiny_style)]
    ]
    
    tabla_firma = Table(firma_table, colWidths=[page_width], rowHeights=[25, 60, 25, 20])
    tabla_firma.setStyle(TableStyle([
        ("BOX", (0, 0), (-1, -1), 0.5, colors.black),
        ("INNERGRID", (0, 0), (-1, -1), 0.25, colors.black),
        ("BACKGROUND", (0, 0), (0, 0), colors.lightgrey),  # Encabezado firma
        ("BACKGROUND", (0, 2), (0, 2), colors.lightgrey),  # Encabezado fecha
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("FONTSIZE", (0, 0), (-1, -1), 8),
        ("ROWBACKGROUNDS", (0, 1), (0, 1), [colors.white]),  # Espacio firma
        ("ROWBACKGROUNDS", (0, 3), (0, 3), [colors.white]),  # Espacio fecha
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
         Paragraph('La información adicional y detallada se encuentra disponible en el siguiente enlace: <a href="https://secretariageneral.ugr.es/pages/proteccion_datos/leyendas-informativas/_img/informacionadicionalmovilidad/" color="blue">https://secretariageneral.ugr.es/pages/proteccion_datos/leyendas-informativas/_img/informacionadicionalmovilidad/</a>', tiny_style)]
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