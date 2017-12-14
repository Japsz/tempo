SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

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
AUTO_INCREMENT = 16
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `mydb`.`egreso`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`egreso` (
  `idegreso` INT(11) NOT NULL AUTO_INCREMENT,
  `idcdc` INT(11) NOT NULL,
  `monto` INT(11) NULL DEFAULT NULL,
  `n_factura` VARCHAR(45) NULL DEFAULT NULL,
  `fecha` DATETIME NULL DEFAULT NULL,
  `fecha_p` DATETIME NULL DEFAULT NULL,
  `detalle` VARCHAR(100) NULL DEFAULT NULL,
  PRIMARY KEY (`idegreso`),
  INDEX `fk_ingreso_cdc_idx` (`idcdc` ASC),
  CONSTRAINT `fk_ingreso_cdc0`
    FOREIGN KEY (`idcdc`)
    REFERENCES `mydb`.`cdc` (`idcdc`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `mydb`.`ingreso`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`ingreso` (
  `idingreso` INT(11) NOT NULL AUTO_INCREMENT,
  `idcdc` INT(11) NOT NULL,
  `monto` INT(11) NULL DEFAULT NULL,
  `n_factura` VARCHAR(45) NULL DEFAULT NULL,
  `fecha` DATETIME NULL DEFAULT NULL,
  `fecha_p` DATETIME NULL DEFAULT NULL,
  `detalle` VARCHAR(100) NULL DEFAULT NULL,
  PRIMARY KEY (`idingreso`),
  INDEX `fk_ingreso_cdc_idx` (`idcdc` ASC),
  CONSTRAINT `fk_ingreso_cdc`
    FOREIGN KEY (`idcdc`)
    REFERENCES `mydb`.`cdc` (`idcdc`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
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
AUTO_INCREMENT = 8
DEFAULT CHARACTER SET = utf8;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

CREATE USER 'admin' IDENTIFIED BY 'tempo123';

GRANT ALL ON `mydb`.* TO 'admin';
GRANT SELECT ON TABLE `mydb`.* TO 'admin';
GRANT SELECT, INSERT, TRIGGER ON TABLE `mydb`.* TO 'admin';
GRANT SELECT, INSERT, TRIGGER, UPDATE, DELETE ON TABLE `mydb`.* TO 'admin';
GRANT EXECUTE ON ROUTINE `mydb`.* TO 'admin';

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
