
-- --------------------------------------------------
-- Entity Designer DDL Script for SQL Server 2005, 2008, 2012 and Azure
-- --------------------------------------------------
-- Date Created: 12/19/2016 10:51:59
-- Generated from EDMX file: C:\Redwood\Projects\Project 3 - Redwood Pong\RedwoodPong\RedwoodPong\PongModel.edmx
-- --------------------------------------------------

SET QUOTED_IDENTIFIER OFF;
GO
USE [PongDatabase];
GO
IF SCHEMA_ID(N'dbo') IS NULL EXECUTE(N'CREATE SCHEMA [dbo]');
GO

-- --------------------------------------------------
-- Dropping existing FOREIGN KEY constraints
-- --------------------------------------------------

IF OBJECT_ID(N'[dbo].[FK_GamePlayer1]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[Games] DROP CONSTRAINT [FK_GamePlayer1];
GO
IF OBJECT_ID(N'[dbo].[FK_GamePlayer]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[Games] DROP CONSTRAINT [FK_GamePlayer];
GO
IF OBJECT_ID(N'[dbo].[FK_GamePlayer2]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[Games] DROP CONSTRAINT [FK_GamePlayer2];
GO
IF OBJECT_ID(N'[dbo].[FK_PlayerGame]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[Games] DROP CONSTRAINT [FK_PlayerGame];
GO

-- --------------------------------------------------
-- Dropping existing tables
-- --------------------------------------------------

IF OBJECT_ID(N'[dbo].[Games]', 'U') IS NOT NULL
    DROP TABLE [dbo].[Games];
GO
IF OBJECT_ID(N'[dbo].[Players]', 'U') IS NOT NULL
    DROP TABLE [dbo].[Players];
GO

-- --------------------------------------------------
-- Creating all tables
-- --------------------------------------------------

-- Creating table 'Games'
CREATE TABLE [dbo].[Games] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [Date] datetime  NOT NULL,
    [PlayerRedScore] int  NOT NULL,
    [PlayerBlueScore] int  NOT NULL,
    [PlayerRedId] int  NOT NULL,
    [PlayerBlueId] int  NOT NULL,
    [WinningPlayerId] int  NOT NULL,
    [LosingPlayerId] int  NOT NULL
);
GO

-- Creating table 'Players'
CREATE TABLE [dbo].[Players] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [FirstName] nvarchar(max)  NOT NULL,
    [LastName] nvarchar(max)  NOT NULL,
    [Image] nvarchar(max)  NULL,
    [CurrentWinStreak] int  NOT NULL,
    [BiggestWinStreak] int  NOT NULL,
    [CurrentLosingStreak] int  NOT NULL,
    [ELO] int  NOT NULL
);
GO

-- --------------------------------------------------
-- Creating all PRIMARY KEY constraints
-- --------------------------------------------------

-- Creating primary key on [Id] in table 'Games'
ALTER TABLE [dbo].[Games]
ADD CONSTRAINT [PK_Games]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'Players'
ALTER TABLE [dbo].[Players]
ADD CONSTRAINT [PK_Players]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- --------------------------------------------------
-- Creating all FOREIGN KEY constraints
-- --------------------------------------------------

-- Creating foreign key on [PlayerRedId] in table 'Games'
ALTER TABLE [dbo].[Games]
ADD CONSTRAINT [FK_GamePlayer1]
    FOREIGN KEY ([PlayerRedId])
    REFERENCES [dbo].[Players]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_GamePlayer1'
CREATE INDEX [IX_FK_GamePlayer1]
ON [dbo].[Games]
    ([PlayerRedId]);
GO

-- Creating foreign key on [PlayerBlueId] in table 'Games'
ALTER TABLE [dbo].[Games]
ADD CONSTRAINT [FK_GamePlayer]
    FOREIGN KEY ([PlayerBlueId])
    REFERENCES [dbo].[Players]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_GamePlayer'
CREATE INDEX [IX_FK_GamePlayer]
ON [dbo].[Games]
    ([PlayerBlueId]);
GO

-- Creating foreign key on [WinningPlayerId] in table 'Games'
ALTER TABLE [dbo].[Games]
ADD CONSTRAINT [FK_GamePlayer2]
    FOREIGN KEY ([WinningPlayerId])
    REFERENCES [dbo].[Players]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_GamePlayer2'
CREATE INDEX [IX_FK_GamePlayer2]
ON [dbo].[Games]
    ([WinningPlayerId]);
GO

-- Creating foreign key on [LosingPlayerId] in table 'Games'
ALTER TABLE [dbo].[Games]
ADD CONSTRAINT [FK_PlayerGame]
    FOREIGN KEY ([LosingPlayerId])
    REFERENCES [dbo].[Players]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_PlayerGame'
CREATE INDEX [IX_FK_PlayerGame]
ON [dbo].[Games]
    ([LosingPlayerId]);
GO

-- --------------------------------------------------
-- Script has ended
-- --------------------------------------------------