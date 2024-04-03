// Copyright (c) RoochNetwork
// SPDX-License-Identifier: Apache-2.0

import { createContext, useEffect, useRef, useState, ReactElement } from 'react'
import type { StateStorage } from 'zustand/middleware'

import { createWalletStore, WalletStore } from '../walletStore'
import { useAutoConnectWallet, useRoochClient, useWalletStore } from '../hooks'
import { getInstalledWallets } from '../utils/walletUtils'
import { BaseWallet, UniSatWallet, WalletAccount } from '../types'
import { SupportChain } from '../feature'

type WalletProviderProps = {
  chain?: SupportChain

  /** Enables automatically reconnecting to the most recently used wallet account upon mounting. */
  autoConnect?: boolean

  /** Configures how the most recently connected to wallet account is stored. Defaults to using localStorage. */
  storage?: StateStorage

  /** The key to use to store the most recently connected wallet account. */
  storageKey?: string

  children: ReactElement

  fallback?: ReactElement
}

const DEFAULT_STORAGE_KEY = 'rooch-sdk-kit:wallet-connect-info'

export const WalletContext = createContext<WalletStore | null>(null)

export function WalletProvider({
  chain = SupportChain.BITCOIN,
  storage,
  storageKey = DEFAULT_STORAGE_KEY,
  autoConnect = false,
  children,
  fallback,
}: WalletProviderProps) {
  const [wallets, setWallets] = useState<BaseWallet[]>()
  const [loading, setLoading] = useState(true)
  const storeRef = useRef<ReturnType<typeof createWalletStore>>()
  const client = useRoochClient()

  useEffect(() => {
    getInstalledWallets(client).then((v) => setWallets(v))
  }, [chain, client])

  useEffect(() => {
    if (wallets && wallets.length !== 0) {
      storeRef.current = createWalletStore({
        chain,
        wallets: wallets,
        currentWallet: wallets.find((v) => v.getChain() === chain) ?? new UniSatWallet(client), // default use unisat
        autoConnectEnabled: autoConnect,
        storage: storage ?? sessionStorage,
        storageKey,
      })
      setLoading(false)
    }
  }, [client, wallets, autoConnect, storageKey, storage, chain])

  return !loading ? (
    <WalletContext.Provider value={storeRef.current!}>
      <WalletConnectionManager>{children}</WalletConnectionManager>
    </WalletContext.Provider>
  ) : fallback ? (
    fallback
  ) : null
}

type WalletConnectionManagerProps = Required<Pick<WalletProviderProps, 'children'>>

function WalletConnectionManager({ children }: WalletConnectionManagerProps) {
  useAutoConnectWallet()

  const connectionStatus = useWalletStore((store) => store.connectionStatus)
  const currentWallet = useWalletStore((store) => store.currentWallet)
  const setWalletDisconnected = useWalletStore((store) => store.setWalletDisconnected)
  const setConnectionStatus = useWalletStore((state) => state.setConnectionStatus)
  const setAccountSwitched = useWalletStore((store) => store.setAccountSwitched)
  const currentAccount = useWalletStore((state) => state.currentAccount)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const accountsChangedHandler = async (accounts: WalletAccount[]) => {
    if (accounts.length === 0) {
      setWalletDisconnected()
    } else {
      setConnectionStatus('connecting')
      const selectedAccount = accounts[0]
      if (selectedAccount.address !== currentAccount?.address) {
        setAccountSwitched(selectedAccount)
      }
    }
  }
  useEffect(() => {
    if (connectionStatus === 'connected') {
      currentWallet.onAccountsChanged(accountsChangedHandler)
    }

    return () => {
      if (connectionStatus === 'connected') {
        currentWallet.removeAccountsChanged(accountsChangedHandler)
      }
    }
  }, [accountsChangedHandler, connectionStatus, currentWallet])
  return children
}
