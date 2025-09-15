/****** Object:  StoredProcedure [dbo].[UpdateInvoiceCreatedStatus]    Script Date: 2023-10-30 10:11:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[UpdateInvoiceCreatedStatus]
    @D365JENumber nvarchar(25) = null,
	@OIDocumentID nvarchar(25) = null
AS
BEGIN
    BEGIN TRANSACTION

	
	--Update row with D365JournalCreated = 0, MessageBody = 'This has been updated to bypass duplicate check' - [MessageBody]
	UPDATE [dbo].[D365APInvoiceAudit]
    SET [D365JournalCreated] = 0, [MessageBody] = 'This has been updated to bypass duplicate check - ' + [MessageBody]
	OUTPUT INSERTED.*
	WHERE ([D365JENumber] = @D365JENumber OR [OIDocumentID]= @OIDocumentID) AND AND ([D365JournalCreated] = 1 or [D365JournalCreated] is null) 
	
    IF @@ERROR <> 0
    BEGIN
        ROLLBACK TRANSACTION
        RETURN 0
    END

    COMMIT TRANSACTION
    RETURN 1
END
