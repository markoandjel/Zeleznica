using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Web_projekat.Migrations
{
    public partial class v1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Ruta",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Cena = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Ruta", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "Stanica",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Naziv = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    GodinaIzgradnje = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Stanica", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "Voz",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Naziv = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Kapacitet = table.Column<int>(type: "int", nullable: false),
                    Broj_Putnika = table.Column<int>(type: "int", nullable: false),
                    RutaID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Voz", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Voz_Ruta_RutaID",
                        column: x => x.RutaID,
                        principalTable: "Ruta",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "RutaStanica",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StanicaID = table.Column<int>(type: "int", nullable: true),
                    RutaID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RutaStanica", x => x.ID);
                    table.ForeignKey(
                        name: "FK_RutaStanica_Ruta_RutaID",
                        column: x => x.RutaID,
                        principalTable: "Ruta",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_RutaStanica_Stanica_StanicaID",
                        column: x => x.StanicaID,
                        principalTable: "Stanica",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "VozUStanici",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PristigliPutnici = table.Column<int>(type: "int", nullable: false),
                    Vreme_Odlaska = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Vreme_Dolaska = table.Column<DateTime>(type: "datetime2", nullable: false),
                    StanicaID = table.Column<int>(type: "int", nullable: true),
                    VozID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VozUStanici", x => x.ID);
                    table.ForeignKey(
                        name: "FK_VozUStanici_Stanica_StanicaID",
                        column: x => x.StanicaID,
                        principalTable: "Stanica",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_VozUStanici_Voz_VozID",
                        column: x => x.VozID,
                        principalTable: "Voz",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_RutaStanica_RutaID",
                table: "RutaStanica",
                column: "RutaID");

            migrationBuilder.CreateIndex(
                name: "IX_RutaStanica_StanicaID",
                table: "RutaStanica",
                column: "StanicaID");

            migrationBuilder.CreateIndex(
                name: "IX_Voz_RutaID",
                table: "Voz",
                column: "RutaID");

            migrationBuilder.CreateIndex(
                name: "IX_VozUStanici_StanicaID",
                table: "VozUStanici",
                column: "StanicaID");

            migrationBuilder.CreateIndex(
                name: "IX_VozUStanici_VozID",
                table: "VozUStanici",
                column: "VozID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RutaStanica");

            migrationBuilder.DropTable(
                name: "VozUStanici");

            migrationBuilder.DropTable(
                name: "Stanica");

            migrationBuilder.DropTable(
                name: "Voz");

            migrationBuilder.DropTable(
                name: "Ruta");
        }
    }
}
