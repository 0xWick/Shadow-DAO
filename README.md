
# Live DApp Link: https://polygon-id-frontend.vercel.app/

## `Here for the verification Lifecycle: `

### `Shadow DAO`

-> Member creates a Proposal and present it to the DAO
-> DAO members vote for/against on the proposal
-> After the Deadline for voting has passed, the OWNER can countVotes and end the proposal
-> If Passed: The Required Amount is transfered to the Proposer. And if Rejected: Proposer get's nothing

## Things to Try

### `You can:`

-> Create Proposals
![image](https://user-images.githubusercontent.com/69587947/227927145-6e5d4cd3-7024-4249-9d44-99e501bbc295.png)

-> Vote on Proposals
![image](https://user-images.githubusercontent.com/69587947/227927923-89613f9a-b4c2-46af-8086-39e58edffc99.png)

-> Donate to the DAO
![image](https://user-images.githubusercontent.com/69587947/227927355-c300484e-4805-44ed-8a75-100f7034cdf1.png)

### `Only Owner:`

1. All the above, and
2. Count Votes (Change the Proposal Status to Rejected/Passed)
![image](https://user-images.githubusercontent.com/69587947/227927454-507f0d61-9ece-4176-8988-bdb24239a759.png)
![image](https://user-images.githubusercontent.com/69587947/227927815-08f55775-9edf-45fb-be70-9228fae76ef9.png)

### DAO transfered the "Required Amount" to the Proposer
![image](https://user-images.githubusercontent.com/69587947/227928076-1f6ee474-2695-4ecc-b8b5-ca45111355a2.png)

# `3. Owner Also gets an Owner Panel`

### Owner Panel:
![image](https://user-images.githubusercontent.com/69587947/227928196-f8cf1f22-fefd-46cf-b356-d098b3bcb7d5.png)

1. A `"Withdraw"` button for withdrawing all funds in the DAO (A multisig can be added for security but since we have the ID of the Owner its not an issue)

2. `"Issue New Membership"` , Enter a User's PID(in uint256, you can find it in the Event Logs named "userRegistered" Event) with which the user registered an Eth Address. And "Remove" both (PID & Eth Address) from already registered. Hence, issuing a New Membership because that PID can now register a new Eth Address.

3. `"Revoke Membership"` , Enter an Eth Address to kick him from the DAO's verified Members. Since, the PID is not removed from the registered PID's. This user can't register a new Eth Address.

## Verification Checks

1. One PID can't register more than one Eth Address (unless issued a New Membership)
![image](https://user-images.githubusercontent.com/69587947/208858843-0b5aa396-fa01-4794-93ce-82d73de2bec1.png)

2. If someone else tries to issue a NewMembership
![image](https://user-images.githubusercontent.com/69587947/208859500-20f1d19d-3372-499c-ae69-dc23852076a7.png)

3. Duplicate Registration Check
![image](https://user-images.githubusercontent.com/69587947/208859716-030c555d-aebb-411a-ad11-1cdffc526b4d.png)
