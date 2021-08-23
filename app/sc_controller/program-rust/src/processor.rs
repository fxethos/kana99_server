use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint::ProgramResult,
    msg,
    program_error::ProgramError,
    log::sol_log_compute_units,
    pubkey::Pubkey,
    
};

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct InstructionData {
    pub receiveddata: String,
    pub datatype: u64,

}

// #[derive(BorshSerialize, BorshDeserialize, Debug)]
// pub struct Amount {
//     pub amount: String,
//     pub datatype: u64,

// }
// #[derive(BorshSerialize, BorshDeserialize, Debug)]
// pub struct ContestInstruction {
//     pub contestids: String,
//     pub datatype: u64,

// }

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {

    let accounts_iter = &mut accounts.iter();

    let message = InstructionData::try_from_slice(instruction_data).map_err(|err| {
        msg!("Receiving message as string utf8 failed, {:?}", err);
        ProgramError::InvalidInstructionData
    })?;

   // msg!("message {:?}", message);

     
    if message.datatype == 1 {
        msg!("Recieved request for payouts");
        let source_info = next_account_info(accounts_iter)?;
        let destination_info = next_account_info(accounts_iter)?;
        let amount = message.receiveddata;
        //The account must be owned by the program in order to modify its data
        if source_info.owner != program_id {
            msg!("Greeted account does not have the correct program id");
            return Err(ProgramError::IncorrectProgramId);
        };

       

        // Withdraw five lamports from the source
        **source_info.try_borrow_mut_lamports()? -= 6;
        // Deposit five lamports into the destination
        **destination_info.try_borrow_mut_lamports()? += 6;
        msg!("paid {:?} ",amount);

    } else if message.datatype == 2{
        let account = next_account_info(accounts_iter)?;
        //let contestid = message.receiveddata;

        // let  greeting_account = ContestInstruction::try_from_slice(&account.data.borrow())?;
        // greeting_account.serialize(&mut &mut account.data.borrow_mut()[..])?;
        //msg!("contestid {:?}",contestid);
        let data = &mut &mut account.data.borrow_mut();
        msg!("length {:?}",instruction_data.len());

        //msg!("Start save instruction into data");
        data[..instruction_data.len()].copy_from_slice(&instruction_data);
        msg!("length {:?}",instruction_data.len());
        sol_log_compute_units();


    };

   
    

    Ok(())
}


