-- MySQL Script generated by MySQL Workbench
-- 12/22/17 05:11:14
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8 ;
USE `mydb` ;

-- -----------------------------------------------------
-- Table `mydb`.`cdc`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`cdc` (
  `idcdc` INT(11) NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NULL DEFAULT NULL,
  `f_inicio` DATETIME NOT NULL,
  `f_fin` DATETIME NULL DEFAULT NULL,
  `monto_final` INT(11) NULL DEFAULT NULL,
  PRIMARY KEY (`idcdc`))
ENGINE = InnoDB
AUTO_INCREMENT = 27
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `mydb`.`pago`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`pago` (
  `idpago` INT(11) NOT NULL AUTO_INCREMENT,
  `idcdc` INT(11) NOT NULL,
  `monto` INT(11) NULL DEFAULT NULL,
  `n_factura` VARCHAR(45) NULL DEFAULT NULL,
  `fecha` DATETIME NULL DEFAULT NULL,
  `fecha_p` DATETIME NULL DEFAULT NULL,
  `detalle` VARCHAR(100) NULL DEFAULT NULL,
  `tipo` VARCHAR(20) NULL DEFAULT NULL,
  PRIMARY KEY (`idpago`),
  INDEX `fk_pago_cdc_idx` (`idcdc` ASC),
  CONSTRAINT `fk_pago_cdc`
    FOREIGN KEY (`idcdc`)
    REFERENCES `mydb`.`cdc` (`idcdc`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 952
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `mydb`.`egreso`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`egreso` (
  `idegreso` INT(11) NOT NULL AUTO_INCREMENT,
  `idcdc` INT(11) NOT NULL,
  `idpago` INT(11) NULL DEFAULT NULL,
  `monto` INT(11) NULL DEFAULT NULL,
  `fecha` DATETIME NULL DEFAULT NULL,
  `detalle` VARCHAR(100) NULL DEFAULT NULL,
  `tipo` VARCHAR(10) NULL DEFAULT NULL,
  `fechacreacion` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idegreso`),
  INDEX `fk_egreso_idpago_idx` (`idpago` ASC),
  INDEX `fk_egreso_idcdc_idx` (`idcdc` ASC),
  CONSTRAINT `fk_egreso_cdc`
    FOREIGN KEY (`idcdc`)
    REFERENCES `mydb`.`cdc` (`idcdc`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_egreso_pago`
    FOREIGN KEY (`idpago`)
    REFERENCES `mydb`.`pago` (`idpago`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 377
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `mydb`.`ingreso`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`ingreso` (
  `idingreso` INT(11) NOT NULL AUTO_INCREMENT,
  `idpago` INT(11) NULL DEFAULT NULL,
  `idcdc` INT(11) NOT NULL,
  `monto` INT(11) NULL DEFAULT NULL,
  `fecha` DATETIME NULL DEFAULT NULL,
  `detalle` VARCHAR(100) NULL DEFAULT NULL,
  `tipo` VARCHAR(10) NULL DEFAULT NULL,
  PRIMARY KEY (`idingreso`),
  INDEX `fk_ingreso_idcdc_idx` (`idcdc` ASC),
  INDEX `fk_ingreso_idpago_idx` (`idpago` ASC),
  CONSTRAINT `fk_ingreso_cdc`
    FOREIGN KEY (`idcdc`)
    REFERENCES `mydb`.`cdc` (`idcdc`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_ingreso_pago`
    FOREIGN KEY (`idpago`)
    REFERENCES `mydb`.`pago` (`idpago`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 168
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `mydb`.`user` (
  `idingreso` INT(3) NOT NULL AUTO_INCREMENT,
  `idpago` VARCHAR(50) NOT NULL,
  `pass` VARCHAR(11) NOT NULL,
  PRIMARY KEY (`iduser`))
DEFAULT CHARACTER SET = utf8;



SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
