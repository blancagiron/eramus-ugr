from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import cm
from reportlab.pdfgen import canvas
from reportlab.platypus import (
    SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
)
from reportlab.lib.styles import getSampleStyleSheet
import os

def generar_pdf_acuerdo(acuerdo):
    email = acuerdo.get('email_estudiante', 'anonimo')
    output_path = f"/tmp/acuerdo_{email}.pdf"

    doc = SimpleDocTemplate(output_path, pagesize=A4,
                            rightMargin=2*cm, leftMargin=2*cm,
                            topMargin=2*cm, bottomMargin=2*cm)

    elements = []
    styles = getSampleStyleSheet()
    title = styles["Title"]
    subtitle = styles["Heading4"]
    normal = styles["Normal"]

    # ===== TÍTULO PRINCIPAL =====
    elements.append(Paragraph("Acuerdo de Estudios", title))
    elements.append(Spacer(1, 24))

    # ===== DATOS PERSONALES =====
    elements.append(Paragraph("Datos Personales", subtitle))
    dp = acuerdo.get("datos_personales", {})

    user_table_data = [
        ["Nombre", dp.get("nombre", "")],
        ["Apellidos", dp.get("apellidos", "")],
        ["Correo electrónico", dp.get("email", email)],
        ["DNI / NIF", dp.get("dni", "")]
    ]
    tabla_user = Table(user_table_data, colWidths=[5*cm, 10*cm])
    tabla_user.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.lightgrey),
        ("BOX", (0, 0), (-1, -1), 0.3, colors.black),
        ("INNERGRID", (0, 0), (-1, -1), 0.25, colors.black),
    ]))
    elements.append(tabla_user)
    elements.append(Spacer(1, 16))

    # ===== DATOS DE MOVILIDAD =====
    elements.append(Paragraph("Datos de Movilidad", subtitle))
    dm = acuerdo.get("datos_movilidad", {})

    movilidad_data = [
        ["Programa", dm.get("programa", "")],
        ["Curso académico", dm.get("curso_academico", "")],
        ["Universidad de destino", dm.get("nombre_universidad", "")],
        ["Código univer. destino", dm.get("codigo_universidad", acuerdo.get("destino_codigo", ""))],
        ["País", dm.get("pais", "")],
        ["Periodo de estudios", dm.get("periodo_estudios", "")],
        ["Responsable Académico", dm.get("responsable", "")],
        ["Tutor Docente", dm.get("tutor", "")],
        ["Email Tutor Docente", dm.get("email_tutor", "")]
    ]
    tabla_mov = Table(movilidad_data, colWidths=[6*cm, 9*cm])
    tabla_mov.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.lightgrey),
        ("BOX", (0, 0), (-1, -1), 0.3, colors.black),
        ("INNERGRID", (0, 0), (-1, -1), 0.25, colors.black),
    ]))
    elements.append(tabla_mov)
    elements.append(Spacer(1, 16))

    # ===== BLOQUES DE ASIGNATURAS =====
    elements.append(Paragraph("Equivalencias Asignaturas UGR ↔ Destino", subtitle))
    bloques = acuerdo.get("bloques", [])

    if not bloques:
        elements.append(Paragraph("No hay asignaturas añadidas.", normal))
    else:
        header = [
            "Asignatura UGR", "Curso", "Semestre", "ECTS", "Tipo",
            "Asignatura Destino", "Curso", "Semestre", "ECTS"
        ]
        tabla_datos = [header]

        for b in bloques:
            ugr = b.get("asignaturas_ugr", [{}])[0]
            dest = b.get("asignaturas_destino", [{}])[0]

            fila = [
                ugr.get("nombre", ""), ugr.get("curso", ""), ugr.get("semestre", ""),
                ugr.get("ects", ""), ugr.get("tipo", ""),
                dest.get("nombre", ""), dest.get("curso", ""), dest.get("semestre", ""),
                dest.get("ects", "")
            ]
            tabla_datos.append(fila)

        tabla_bloques = Table(tabla_datos, colWidths=[3*cm]*9)
        tabla_bloques.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.lightblue),
            ("GRID", (0, 0), (-1, -1), 0.25, colors.black),
            ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ]))
        elements.append(tabla_bloques)

        # Totales
        total_ugr = sum(b["asignaturas_ugr"][0].get("ects", 0) for b in bloques)
        total_dest = sum(b["asignaturas_destino"][0].get("ects", 0) for b in bloques)

        elements.append(Spacer(1, 12))
        elements.append(Paragraph(f"Total ECTS UGR: <strong>{total_ugr}</strong>", normal))
        elements.append(Paragraph(f"Total ECTS Destino: <strong>{total_dest}</strong>", normal))

    # ===== GENERAR DOCUMENTO =====
    doc.build(elements)
    return output_path
