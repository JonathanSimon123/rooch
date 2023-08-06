// Copyright (c) RoochNetwork
// SPDX-License-Identifier: Apache-2.0

use moveos_types::transaction::MoveAction;
use rooch_framework::bindings::empty::Empty;
use rooch_key::keystore::{AccountKeystore, InMemKeystore};
use rooch_types::{
    crypto::BuiltinScheme,
    transaction::{rooch::RoochTransactionData, AbstractTransaction},
};

use crate::binding_test;

#[test]
fn test_validate_ed25519() {
    let binding_test = binding_test::RustBindingTest::new().unwrap();
    let transaction_validator = binding_test.as_module_bundle::<rooch_framework::bindings::transaction_validator::TransactionValidator>();

    let keystore = InMemKeystore::new_ed25519_insecure_for_tests(1);
    let sender = keystore.addresses()[0];
    let sequence_number = 0;
    let action = MoveAction::new_function_call(Empty::empty_function_id(), vec![], vec![]);
    let tx_data = RoochTransactionData::new(sender, sequence_number, action);
    let tx = keystore
        .sign_transaction(&sender, tx_data, BuiltinScheme::Ed25519)
        .unwrap();
    let auth_info = tx.authenticator_info();
    let move_tx = tx.construct_moveos_transaction(sender.into()).unwrap();

    transaction_validator
        .validate(&move_tx.ctx, auth_info)
        .unwrap();
}

#[test]
fn test_validate_ecdsa() {
    let binding_test = binding_test::RustBindingTest::new().unwrap();
    let transaction_validator = binding_test.as_module_bundle::<rooch_framework::bindings::transaction_validator::TransactionValidator>();

    let keystore = InMemKeystore::new_ecdsa_insecure_for_tests(1);
    let sender = keystore.addresses()[0];
    let sequence_number = 0;
    let action = MoveAction::new_function_call(Empty::empty_function_id(), vec![], vec![]);
    let tx_data = RoochTransactionData::new(sender, sequence_number, action);
    let tx = keystore
        .sign_transaction(&sender, tx_data, BuiltinScheme::Ecdsa)
        .unwrap();
    let auth_info = tx.authenticator_info();
    let move_tx = tx.construct_moveos_transaction(sender.into()).unwrap();

    transaction_validator
        .validate(&move_tx.ctx, auth_info)
        .unwrap();
}

#[test]
fn test_validate_ecdsa_recoverable() {
    let binding_test = binding_test::RustBindingTest::new().unwrap();
    let transaction_validator = binding_test.as_module_bundle::<rooch_framework::bindings::transaction_validator::TransactionValidator>();

    let keystore = InMemKeystore::new_ecdsa_recoverable_insecure_for_tests(1);
    let sender = keystore.addresses()[0];
    let sequence_number = 0;
    let action = MoveAction::new_function_call(Empty::empty_function_id(), vec![], vec![]);
    let tx_data = RoochTransactionData::new(sender, sequence_number, action);
    let tx = keystore
        .sign_transaction(&sender, tx_data, BuiltinScheme::EcdsaRecoverable)
        .unwrap();
    let auth_info = tx.authenticator_info();
    let move_tx = tx.construct_moveos_transaction(sender.into()).unwrap();

    transaction_validator
        .validate(&move_tx.ctx, auth_info)
        .unwrap();
}

#[test]
fn test_validate_schnorr() {
    let binding_test = binding_test::RustBindingTest::new().unwrap();
    let transaction_validator = binding_test.as_module_bundle::<rooch_framework::bindings::transaction_validator::TransactionValidator>();

    let keystore = InMemKeystore::new_schnorr_insecure_for_tests(1);
    let sender = keystore.addresses()[0];
    let sequence_number = 0;
    let action = MoveAction::new_function_call(Empty::empty_function_id(), vec![], vec![]);
    let tx_data = RoochTransactionData::new(sender, sequence_number, action);
    let tx = keystore
        .sign_transaction(&sender, tx_data, BuiltinScheme::Schnorr)
        .unwrap();
    let auth_info = tx.authenticator_info();
    let move_tx = tx.construct_moveos_transaction(sender.into()).unwrap();

    transaction_validator
        .validate(&move_tx.ctx, auth_info)
        .unwrap();
}
