<template>
  <section>
    <h2>New VF (Dice)</h2>
    <table>
      <tr>
        <th>Payment token</th>
        <td>
          <select v-model="selectedPaymentToken">
            <option v-for="paymentToken in paymentTokens" :value="paymentToken" :key="paymentToken.id">{{
                paymentToken.name
            }}</option>
          </select>
        </td>
      </tr>
      <tr>
        <th>tResolve</th>
        <td>
          in <input v-model="tResolve" type="number" /> minutes
        </td>
      </tr>
    </table>
    <div>
      <button @click="createVirtualFloor">Create VF</button>
    </div>
  </section>
</template>

<script lang="ts">
/* eslint-disable camelcase */

import {
  RandomDoubleDiceApp as RandomDoubleDiceAppContract,
  DoubleDiceProtocol as DoubleDiceProtocolContract
} from '@doubledice/platform/lib/contracts'
import { PaymentToken as PaymentTokenEntity } from '@doubledice/platform/lib/graph'
import { PropType } from 'vue'
import { Options, Vue } from 'vue-class-component'
import { generateRandomVirtualFloorId, tryCatch } from '../utils'

// See https://class-component.vuejs.org/guide/class-component.html#data
// > Note that if the initial value is undefined,
// > the class property will not be reactive which means the changes for the properties
// > will not be detected
const NOT_UNDEFINED_STRING = ''

@Options({
  props: {
    protocolContract: Object as PropType<DoubleDiceProtocolContract>,
    appContract: Object as PropType<RandomDoubleDiceAppContract>,
    paymentTokens: Object as PropType<PaymentTokenEntity[]>,
    nextBlockTimestamp: Number
  },
})
export default class NewVirtualFloor extends Vue {
  protocolContract!: DoubleDiceProtocolContract
  appContract!: RandomDoubleDiceAppContract

  paymentTokens!: PaymentTokenEntity[]

  nextBlockTimestamp!: number

  // nullable because otherwise property won't be picked up during setup; ToDo: Find a better way
  selectedPaymentToken: PaymentTokenEntity | null = null

  tResolve = NOT_UNDEFINED_STRING

  async created(): Promise<void> {
    this.selectedPaymentToken = this.paymentTokens[0]
    this.tResolve = '60'
  }

  async createVirtualFloor(): Promise<void> {
    const vfId = generateRandomVirtualFloorId()
    let tResolve = this.nextBlockTimestamp + Number(this.tResolve) * 60
    tResolve = tResolve - (tResolve % 60)
    const { address: paymentToken } = this.selectedPaymentToken as PaymentTokenEntity

    // eslint-disable-next-line space-before-function-paren
    await tryCatch(async () => {
      console.log(`this.appContract = ${this.appContract.address}`)
      const tx = await this.appContract.createVirtualFloor(vfId, tResolve, paymentToken)
      const { hash } = tx
      const txUrl = `https://polygonscan.com/tx/${hash}`
      console.log(`Sent ${txUrl}`)
      await tx.wait()
      console.log(`⛏ Mined ${txUrl}`)
    })
  }
}
</script>

<style scoped>
</style>
