use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint::ProgramResult,
    msg,
    pubkey::Pubkey,
    program_error::ProgramError,

};



#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct Amount{
    pub amount: u64,

}




pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {


   
    let accounts_iter = &mut accounts.iter();

    let source_info = next_account_info(accounts_iter)?;
    let destination_info = next_account_info(accounts_iter)?;

    // The account must be owned by the program in order to modify its data
    if source_info.owner != program_id {
        msg!("Greeted account does not have the correct program id");
        return Err(ProgramError::IncorrectProgramId);
    }

        
    let message = Amount::try_from_slice(instruction_data).map_err(|err| {
        msg!("Receiving message as string utf8 failed, {:?}", err);
        ProgramError::InvalidInstructionData  
      })?;
     

    // Withdraw five lamports from the source
    **source_info.try_borrow_mut_lamports()? -= message.amount;
    // Deposit five lamports into the destination
    **destination_info.try_borrow_mut_lamports()? += message.amount;

    msg!("paid {:?} to {:?}", message.amount, destination_info.key);

    Ok(())

   
}

